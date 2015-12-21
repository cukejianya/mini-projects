var request = require('request');
var path = require('path');
var urlApi = require('url');
var variables;
//Deep Copy Object
var readyCount = 3;

//helper functions
function formatURL(protocol, host, path, queryObj){
  var url = urlApi.format({
    protocol: protocol,
    hostname: host,
    pathname: path,
    query: queryObj,
  });
  return url;
}

function getCode(dict) {
  var keys = Object.keys(dict);
  return keys.reduce(function(arr, variable) {
    arr.push(dict[variable]);
    return arr;
  }, []);
}

function reformatData(dict, data, callback) {
  var keys = Object.keys(dict);
  keys.forEach(function(key) {
    // console.log(key);
    dict[key].forEach(function(code, idx) {
      var data_idx = data[0].indexOf(code);
      dict[key][idx] = parseInt(data[1][data_idx]);

      if(dict[key].length === (idx + 1)){
        dict[key] = dict[key].reduce(function(prev, current) {
          return prev + current;
        }, 0);
      }
    });
  });
  readyCount--;
  if (readyCount < 1) {
    callback(null, variables);
  }
}

function createQuery(fips, type) {
  var fips = fips.split('');
  var stateFIPS = fips.splice(0,2).join('');
  var countyFIPS = fips.splice(0,3).join('');
  var tractFIPS = fips.splice(0,6).join('');
  var fipsArray = ['state:'+stateFIPS, 'county:'+countyFIPS, 'tract:'+tractFIPS];
  console.log("country fips:",countyFIPS);
  var query = {
    key: '9690f87a492f7f74100be910a9dc9ce10b598f93',
    for:'tract:'+tractFIPS,
    in: 'state:'+stateFIPS+'+county:'+countyFIPS
  };

  if (type === "administrative_area_level_1") {
    query.for = fipsArray[0];
    delete query.in;
  } else if (type === "administrative_area_level_2" || type === "locality") {
    query.for = fipsArray[1];;
    query.in = fipsArray[0]
  }

  return query;
}


//Main functions
function convertCoords(latitude, longitude, type, callback) {
  var query = {
    format: 'json',
    latitude: latitude,
    longitude: longitude,
    showall: false
  }
  var url = formatURL('http','data.fcc.gov', '/api/block/find', query);
  variables = JSON.parse( JSON.stringify(
    require('./data/censusVariables.json')
  ));;

  request(url, function getFIPS(error, response, body){
    if(error){ callback(error) };
    if (!error && response.statusCode == 200)
      getGeoInfo(JSON.parse(body).Block.FIPS, type, callback);
  })
  //console.log(variables);
}

function getCensusData(type, query, callback){
  var typeDict = variables[type];
  var typeCode = getCode(typeDict);
  query.get = typeCode.sort().join();
  var url = formatURL('http','api.census.gov','/data/2010/sf1', query);
  console.log(url);
  request(url, function(error, response, body) {
    if(error){ callback(error) };
    if (!error && response.statusCode == 200)
      reformatData(typeDict, JSON.parse(body), callback);
  });
}

function getGeoInfo(fips, type, callback) {

  var query = createQuery(fips, type);

  var categories = Object.keys(variables);
  categories.forEach(function(elm, idx) {
    if (elm === "econ")
      return;

    getCensusData(elm, query.clone(), callback);
  })

}

module.exports = {
  convertCoords: convertCoords,
}

Object.prototype.clone = function() {
  var that = this;
  var keys = Object.keys(that);
  var copy = keys.reduce(function(prev, elm){
    prev[elm] = that[elm];
    return prev;
  }, {});
  return copy;
}

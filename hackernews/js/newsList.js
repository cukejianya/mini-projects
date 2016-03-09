var _ = require('lodash');
var NewsHeader = require('./newsHeader');
var NewsItem = require('./newsItem');
var React = require('react');

var NewsList = React.createClass({
  render: function() {
    return (
      <div className="newsList">
        <NewsHeader/>
          <div className="newList-newItems">
            {_(this.props.items).map(function (item, index) {
              return <NewsItem key={item.id} item={item} rank={index + 1}/>;
            }.bind(this)).value()}
          </div>
        </div>
    );
  }
});

module.exports = NewsList;

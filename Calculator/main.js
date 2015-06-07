var operationArr = [];
var input = document.getElementById("screen");
var decimal = true;
input.value = 0;
var operBool = false;


$('.button').on('click', function(e) {

	e.stopPropagation();

	setFocus();

		var id = $(event.target).attr('id');
		var cls = $(event.target).attr('class');
		console.log("Class: "+ cls);
		var button = document.getElementById(id);
		console.log(typeof id + ": " + id);

	console.log(button.innerHTML);


	if(/[0-9]/.test(button.innerHTML) || (button.innerHTML === '.' && decimal)) {

		if(button.innerHTML === '.')
				decimal = false;

		if(input.value === "0" && button.innerHTML !== '.')
				input.value = button.innerHTML;
		else
				input.value += button.innerHTML;

	} else if(cls.split(" ")[1] === "operator") {

			if(operationArr.length > 2) {
					operationArr.unshift(ans());
					operationArr.push(id);	
			} else {
				 operationArr.push(input.value);
				 operationArr.push(id);
				 clearCal("input", "decimal");
			}
	} else if(button.innerHTML === "=") {
			ans();
	} else if (id === "CE") {
			clearCal();
	}

});





function clearCal(type1, type2, type3) {

	console.log(type1 + " " + type2);

	if (!type1) {
		input.value = "0";
		decimal = true;
		operationArr = [];
	}

	if ((type1 || type2 || type3) === "input") {
			input.value = "0";
	}

	if((type1 || type2 || type3) === "arr") {
			operationArr = [];
	}

	if((type1 || type2 || type3) === "decimal") {
			decimal = true;
	}

}


function setFocus() {
	input.focus();
}

function ans() {
		operationArr[operationArr.length] = input.value;

		var a = parseFloat(operationArr.shift());
		var operation = operationArr.shift();
		console.log(operation);
		var b = parseFloat(operationArr.shift());
		var retans = window[operation](a, b);
		input.value = retans;
		//call 1 of 4 operations

	clearCal("decimal");
	return retans;
}

function operater(a,f,b) {
	return f(a,b);
}
function addition(a,b) {
	return (a + b);
}
function subract(a, b) {
	return a - b;
}
function multiple(a, b) {
	return a * b;
}
function divide (a, b) {
	return a/b;
}

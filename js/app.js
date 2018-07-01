/*
we need some object to hold entries - an entry object
what are its properties?
name, amount

and for entries that are expenses we will have a prototype function that calculates percentage of income

we need to have an on click query for the add button 
- on click creates entry - creates new entry object - and reset input boxes

overall scheme:
1. an event handler to listen for clicks
2. getting inputs
3. storing the new entry into a data structure
4. updating UI with new item
5. calculating the overall budget + additional Maths
6. updating the UI with that info


modules:
ui module: get input values, adding new entries to ui / updating ui
data module: adding new entry to data structure, calculating Maths
control module: event handling


what if we make a prototype function Entry.prototype.addNewEntry()


var UIController = (function(){

	//

})();

var dataController = (function(){

	var x = 33;

	var add = function(a){
		return x + a;
	}

	return {
		publicTest: function(b){
			return add(b);
		}
	}

})();


var eventController = (function(dataCtrl, UICtrl){

	var z = dataCtrl.publicTest(6);

	return {
		anotherOne: function(){
			console.log(z);
		}
	}

})(dataController, UIController);
*/








// with these variable expressions, essentially what will be returned is an object 
//-- the variable will be the object with the methods written in the return

// phase 1 
// 1.
// 2.
// 3.
// 4.
 
// phase 2 
// 1. add event handler for deletion
// 2. Delete item from our data structure
// 3. delete the item from the ui
// 4. recalculate the budget
// 5. update the UI

// phase 3
// 1. calculate individual expense item percentages
// 2. update percentages in UI
// 3. display the current month and year
// 4. number formatting
// 5. improve input field ux






// UI CONTROLLER
var UIController = (function(){

	var DOMstrings = {
		inputType: '.add__type',
		inputDesc: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value', 
		percentageLabel: '.budget__expenses--percentage',
		itemPercentage: '.item__percentage',
		container: '.container',
		dateLabel: '.budget__title--month'
	};

	var formatNumber = function(num, type){
		var numSplit, integ, deci, sign;

		// removing the sign of the number
		num = Math.abs(num);

		// tofixed is a method of the number prototype - methods exist for primitives too --> conversion into an object once invoked
		// limiting number of decimals to 2 - convert to string
		num = num.toFixed(2);

		numSplit = num.split('.');
		// these are now strings
		integ = numSplit[0];
		deci = numSplit[1];

		// stylizing strings - if number is in the thousands (length > 3), then add ,
		if (integ.length > 3){
			//substr returns the part of the string we want
			// first arg is the index number we want, 2nd arg is how many characters we want
			integ = integ.substr(0, integ.length - 3) + ',' + integ.substr(integ.length - 3, 3);
		}

		//ternary operator: if type is exp then return - , else return +

		return (type === 'exp' ? '-' : '+') + ' ' + integ + '.' + deci;
	}

	// nodelist traversal function
	// to go through the nodes in html
	var nodeListForEach = function(list, callback){
		for (var i = 0; i < list.length; i++){
			callback(list[i], i);
		}
	};


	return {
		getInput: function(){

			//scooping the values from the inputs from html
			return {
				type: document.querySelector(DOMstrings.inputType).value, 
				description: document.querySelector(DOMstrings.inputDesc).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		getDOMstrings: function(){
			return DOMstrings;
		},

		changedType: function(){

			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' + 
				DOMstrings.inputDesc + ',' + 
				DOMstrings.inputValue);

			// note: to loop over nodelists, you can't use forEach

			nodeListForEach(fields, function(current){
				current.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
		},

		clearFields: function(){
			var fields, fieldsArr;

			// querySelectorAll will return a list object, not an array
			fields = document.querySelectorAll(DOMstrings.inputDesc + ', ' + DOMstrings.inputValue);

			// slice method in array prototype to return array
			fieldsArr = Array.prototype.slice.call(fields);

			// forEach applies method to each array entry
			fieldsArr.forEach(function(current, index, array){
				current.value = ''
			});

			fieldsArr[0].focus();
		},

		displayDate: function(){
			var now, year, month, months;

			months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

			now = new Date();

			year = now.getFullYear();
			month = now.getMonth();

			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

		},

		addListItem: function(obj, type){

			var html, newHtml, element;

			// create html string with placeholder text
			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp'){
				element = DOMstrings.expenseContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			// replace the placeholder text with actual data

			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			// insert the html into the DOM

			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID){

			var el = document.getElementById(selectorID);

			// removing list item from UI
			el.parentNode.removeChild(el);
		},

		displayBudget: function(obj){

			// ternary operator in argument - a little messy but i dont want to make a new variable
			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, (obj.budget > 0 ? 'inc' : 'exp'));
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

			if (obj.percentage > 0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
		},

		displayPercentages: function(percentages){

			// returns a nodelist; html nodes
			var fields = document.querySelectorAll(DOMstrings.itemPercentage);

			// when we call nodeListForEach, we are passing our callback function into it
			// in function, we loop over our list and in each iteration our callback function is called
			// code here is executed -- number of times

			nodeListForEach(fields, function(current, index){
				if (percentages[index] > 0){
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
		}
	};

})();





// DATA CONTROLLER
var dataController = (function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};	

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	Expense.prototype.calcPerc = function(totalInc){
		if (totalInc > 0){
			this.percentage = Math.round((this.value / totalInc) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPerc = function(){
		return this.percentage;
	}

	// data object that includes an allItems object with arrays of all our expense and income objects
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	var calculateTotal = function(type){

		var sum = 0;

		data.allItems[type].forEach(function(current, index, array){
			sum += current.value;
		});

		data.totals[type] = sum;
	};

	return {
		addItem: function(type, des, val){
			var newItem, ID;

			// create new id
			if (data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// create new item based on 'inc' or 'exp' type
			if (type === 'exp'){
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc'){
				newItem = new Income(ID, des, val);
			}

			// push it into our data structure
			data.allItems[type].push(newItem);

			return newItem;
		},

		calculateBudget: function(){

			// calculate totals incomes and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate the budget: income / expenses
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the percentage of income that we spent
			if (data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		calculatePercentages: function(){

			data.allItems.exp.forEach(function(current, index, array){
				current.calcPerc(data.totals.inc);
			});
		},

		getPercentages: function(){
			var allPerc = data.allItems.exp.map(function(current, index, array){
				return current.getPerc();
			});
			// returning an array with all percentages
			return allPerc;
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		deleteItem: function(type, id){

			var ids, index;

			//map is like forEach but returns brand new array the same length as the referenced array filled with return items

			ids = data.allItems[type].map(function(current){
				return current.id
			});

			console.log(ids);
			console.log('ID number of deleted item is ' + id);


			// indexOf returns index number of the element of the array that we input here
			index = ids.indexOf(id);
			console.log('index number of deleted item is ' + index);

			// splice method removes entry starting at index, number indicates how many items to remove
			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		testing: function(){
			console.log(data);
		}
	};
})();





// GLOBAL CONTROLLER
var globalController = (function(dataCtrl, UICtrl){

	var setupEventListeners = function(){

		var DOMstrangs = UICtrl.getDOMstrings();

		document.querySelector(DOMstrangs.inputBtn).addEventListener('click', ctrlAddItem);

		// passing in the event object 'event' or 'e' into the anon-function
		document.addEventListener('keypress', function(event){

			if (event.keyCode === 13) {
				ctrlAddItem();
			}
		});

		document.querySelector(DOMstrangs.container).addEventListener('click', ctrlDeleteItem);
	
		document.querySelector(DOMstrangs.inputType).addEventListener('change', UICtrl.changedType);
	};

	var updateBudget = function(){

		// calculate budget
		dataCtrl.calculateBudget();

		// return budget
		var budget = dataCtrl.getBudget();

		// display budget on UI
		console.log(budget);

		UICtrl.displayBudget(budget);

	};

	var ctrlAddItem = function(){

		var input, newItem;

		// get the field input data
		input = UICtrl.getInput();
		console.log(input);

		if ((input.description !== '') && (!isNaN(input.value)) && (input.value > 0)) {

			// add the item to the budget controller
			newItem = dataController.addItem(input.type, input.description, input.value);
			console.log(newItem);

			// update the ui

			UICtrl.addListItem(newItem, input.type);

			// clear the fields

			UICtrl.clearFields();

			//calculate and update budget

			updateBudget();

			updatePercentages();
		}
	};

	var ctrlDeleteItem = function(event){
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {
			//inc-1
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
		}

		dataController.deleteItem(type, ID);

		UICtrl.deleteListItem(itemID);

		updateBudget();

		updatePercentages();
	};

	var updatePercentages = function(){

		//1. calculate percentages
		dataCtrl.calculatePercentages();

		//2. read percentages from budget controller
		var percentages = dataCtrl.getPercentages();

		//3. update the ui
		UICtrl.displayPercentages(percentages);
	};

	return {
		init: function(){
			console.log('Application has started');
			UICtrl.displayDate();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};
})(dataController, UIController);


globalController.init();
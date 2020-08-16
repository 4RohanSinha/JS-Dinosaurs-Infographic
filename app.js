//helper function
//this function returns a readable decimal given the numerator and denominator
//it finds the least number of decimal places that prevents a return value of 0 (a really small decimal value)
function getReadableDecimal(numerator, denominator) {
	let round_factor = 10; //how many decimal places should be shown
	const max_iters = 7; //avoid making the decimal too long
	let i = 0; //keep track of number of iterations so far
	let quotient = Math.round((numerator/denominator)*round_factor)/round_factor; //what does the current fraction return

	//only add more decimal places if the quotient is 0
	while (quotient == 0 && i < max_iters) {
		round_factor *= 10; //multiply round factor by 10 - increase # decimal places
		quotient = Math.round((numerator/denominator)*round_factor)/round_factor; //recalculate quotient
	}

	return quotient; //when the decimal is readable, return it
}

//helper function
//reports any invalid input to user
function showInvalidFormError(msg) {
	//the form-error-msg span tag was added to prevent invalid inputs from being submitted
	let errorText = document.getElementById('form-error-msg');
	errorText.innerHTML = `<strong>${msg}</strong>`;
	errorText.style.color = 'red';
}

// Create Dino Constructor
//
function Dino(species, weight, height, diet, where, when, fact, img="", isHuman=false) {
	this.species = species;
	this.weight = weight;
	this.height = height;
	this.diet = diet;
	//allow for objects not to pass in image source - in that case, the image source will default to the image source in the images folder (lowercase the species name)
	//this is needed because for the human, the species will be their name so that their name (not homo sapiens) will show up in the infographic, but a human.png can be specified
	this.img = img;
	if (this.img == "") {
		this.img = "images/" + this.species.toLowerCase() + ".png";
	}
	this.where = where;
	this.when = when;
	this.fact = fact;
	this.isHuman = isHuman;
	//array containing the properties that the getRandomFact method will use to generate information
	this.factProperties = ['weight', 'height', 'diet', 'where', 'when', 'fact'];
}

    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 
// compare weight - difference rounded to one decimal place
Dino.prototype.compareWeight = function(other) {
	let weight_diff = getReadableDecimal(this.weight, other.weight);

	let heavierSpecies = this.species;
	let lighterSpecies = other.species;

	if (weight_diff < 1) {
		weight_diff = getReadableDecimal(other.weight, this.weight);
		heavierSpecies = other.species;
		lighterSpecies = this.species;
	}

	if (weight_diff == 1) return heavierSpecies + ' and ' + lighterSpecies + ' weigh exactly the same.';

	return heavierSpecies + ' weighs about ' + weight_diff + ' times more than ' + lighterSpecies + "."; 
};
    
    // Create Dino Compare Method 2
    // NOTE: Weight in JSON file is in lbs, height in inches.
// compare height - difference rounded to one decimal place
Dino.prototype.compareHeight = function(other) {
	let height_diff = getReadableDecimal(this.height, other.height);

	let tallerSpecies = this.species;
	let shorterSpecies = other.species;

	if (height_diff < 1) {
		height_diff = getReadableDecimal(other.height, this.height);
		tallerSpecies = other.species;
		shorterSpecies = this.species;
	}

	if (height_diff == 1) return tallerSpecies + ' and ' + shorterSpecies + ' are exactly as tall as each other.';

	return tallerSpecies + ' is about ' + height_diff + ' times taller than ' + shorterSpecies + "."; 
};
    
    // Create Dino Compare Method 3
    // NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function(other) {
	const thisDiet = this.diet.toLowerCase();
	const otherDiet = other.diet.toLowerCase();
	if (thisDiet == otherDiet) {
		return 'Both ' + this.species + ' and ' + other.species + ' are ' + thisDiet + "s.";
	}

	return 'While ' + other.species + ' is a ' + otherDiet + ', ' + this.species + ' is a ' + thisDiet + '.';
}

Dino.prototype.getRandomFact = function() {
	//this.factProperties stores the properties that the method can use to generate a random fact for the user
	let factsToChoose = this.factProperties;

	//random int: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	let randomIndex = 1 + Math.floor(Math.random() * factsToChoose.length-1);

	//attribute to give random fact about - get the attribute by indexing the factsToChoose array, which contains the valid keys that contain facts (not keys like this.img, this.species, etc.)
	let attribute = factsToChoose[randomIndex];
	
	//each attribute describes a different part of each dinosaur
	//to report it to the user in a complete sentence, there will have to be if statements to change the sentence structure depending on the attribute.

	//form complete sentence with species' weight
	if (attribute == 'weight')
		return this.species + ' weighed ' + this.weight + ' lbs.';

	//form complete sentence with species' height
	//note that inches should be converted to feet+inches for better readability
	if (attribute == 'height') {
		//report in feet + inches instead of just inches alone for readability
		let feet = Math.floor(this.height/12);
		let inches = this.height % 12;
		
		//this if statement is needed if the dino is exactly 1 foot tall
		//if the other two if statements are executed, they will leave out the scenario that both conditions are true (they return strings, so the other if statement would not be executed)
		if (feet == 1 && inches == 0) return this.species + ' was ' + ' 1 foot tall.';
		if (feet == 1) return this.species + ' was 1 foot ' + inches + ' inches tall.';
		if (inches == 0) return this.species + ' was ' + feet + ' feet tall.';

		//if the species does not meet any of the special cases above, simply write the sentence
		return this.species + ' was ' + feet + ' feet ' + inches + ' inches tall.';
	}

	//write complete sentences given attribute info for the rest of the attributes
	//
	if (attribute == 'diet') { 
		return this.species + ' was a ' + this.diet + '.';
	}

	if (attribute == 'where') {
		return this.species + ' lived in ' + this.where + '.';
	}

	if (attribute == 'when') {
		return this.species + ' lived during the ' + this.when + ' period.';
	}

	if (attribute == 'fact') {
		return this.fact;
	}

	//if the attribute did not meet any of the if statements above, return an empty string which indicates an error.
	return '';
}

//array of all dino objects - all json data has to be put through the Dino constructor function so that compare methods can be used
//AJAX is used to retrieve the data
//until the data has been fully retrieved, the variable would not be available otherwise, so declare it beforehand
let dino_objects = [];

// Create Dino Objects
//immediately-invoked function expression to get dino data from dino.json (on the github repository) using AJAX
//global variable is declared at the top of this script
(function loadFromJSON() {
	//fetch data from github repo
	fetch('https://raw.githubusercontent.com/udacity/Javascript/master/dino.json')
		.then(function(response) { return response.json(); })
		.then(function(data) {
			dino_objects = data.Dinos.map((data) => new Dino(data.species, data.weight, data.height, data.diet, data.where, data.when, data.fact));
			return;
		})
		.catch(function(error) {
			console.log(error);
		});
})();
    // Create Human Object


// Use IIFE to get human data from form
// On button click, prepare and display infographic
document.getElementById('btn').addEventListener('click', (function(ev) {

	//using a closure to avoid constantly creating new infographic and human objects 
	//the returned function will still have access to these variables
	

	let human = {};

	//revealing module pattern for infographic
	let infographic = (function Infographic() {
		objects_ = [];

		function public_loadObjects(objects) {
			objects_ = objects;
		}

		function public_load(human) {
			let grid = document.getElementById('grid');
			objects_.forEach(function(data) {
    				// Generate Tiles for each Dino in Array
				let newDiv = document.createElement('div');
				let randomFact = data.getRandomFact();
				if (data.species == 'Pigeon') randomFact = data.fact;
				newDiv.className = 'grid-item';
				newDiv.style.fontSize = '20px';
				newDiv.innerHTML += `<strong style='font-size: 40px;'> ${data.species} </strong><br />`;
				newDiv.innerHTML += `<img src='${data.img}' />`;
				if (!data.isHuman) {
					newDiv.innerHTML += `<strong>Weight: </strong> ${data.compareWeight(human)} <br /><br />`;
					newDiv.innerHTML += `<strong>Height: </strong> ${data.compareHeight(human)} <br /><br />`;
					newDiv.innerHTML += `<strong>Diet: </strong> ${data.compareDiet(human)} <br /><br />`;
					newDiv.innerHTML += `<strong>Did you know?</strong> ${randomFact} <br /><br />`;
				}
        			// Add tiles to DOM
				grid.appendChild(newDiv);
			});
    
			document.body.removeChild(document.getElementById('dino-compare'));
		}

		return {
			loadObjects: public_loadObjects,
			load: public_load
		};
	})();

	return function() {
		//get name from form
		let human_name = document.getElementById('name').value;

		//if the human name is left blank, show an error
		//NOTE: showInvalidFormError is defined above
		if (human_name.trim() == '') {
			showInvalidFormError('Error: name must be entered.');
			return;
		}

		//prevent the user from using html in the form itself
		human_name = human_name.replaceAll('<', '&lt;');
		human_name = human_name.replaceAll('>', '&gt;');
		human_name = human_name.replaceAll('&', '&amp;');

		//get feet and convert to int
		let human_feet = parseInt(document.getElementById('feet').value);
		//get inches and convert to int
		let human_inches = parseInt(document.getElementById('inches').value);

		//if one of the two numbers is negative or NaN
		if (human_feet < 0 || isNaN(human_feet) || (human_inches < 0 || isNaN(human_inches))) {
			showInvalidFormError('Error: the value entered for height is invalid.');
			return;
		}

		//because human_feet & human_inches are both valid, positive integers, convert them to integers and assign them to human height (in the json file, height is recorded in inches)
		let human_height = (human_feet*12) + human_inches;

		//get human_weight from form and try to convert to int
		let human_weight = parseInt(document.getElementById('weight').value);
		//if conversion is unsuccessful or the number is not positive, report error
		if (isNaN(human_weight) || human_weight <= 0) {
			showInvalidFormError('Error: the weight entered is not a valid positive integer.');
			return;
		}

		//get diet from the form - this will never be blank and automatically defaults to herbivore, so no need to perform further checks on the data
		let human_diet = document.getElementById('diet').value;
		
		//create new dino object and assign it to the human variable that was defined before this returned function in the closure
		human = new Dino(human_name, human_weight, human_height, human_diet, "", "", "", "images/human.png", true);
		
		//insert human object into the dino_objects array - make sure it is in the middle of the array to have its rendering in the center
		dino_objects.splice(Math.floor(dino_objects.length/2), 0, human);
		//load dino_objects into the infographic - the infographic was defined with the revealing module pattern. See above.
		infographic.loadObjects(dino_objects);

		//load the infographic and compare each item to the human
		infographic.load(human);
	};
})());


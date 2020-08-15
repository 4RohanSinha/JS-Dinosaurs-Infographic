//array of all dino objects - all json data has to be put through the Dino constructor function so that compare methods can be used
let dino_objects = {};

//immediately-invoked function expression to get dino data from dino.json (on the github repository) using AJAX
//source for ajax tutorial: https://www.w3schools.com/js/js_json_http.asp
dino_objects = (function loadFromJSON() {
	let xhttp = new XMLHttpRequest();
	let data = {};
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			data = JSON.parse(this.responseText);
			dino_objects = data.Dinos.map((data) => new Dino(data.species, data.weight, data.height, data.diet, data.where, data.when, data.fact));
			return dino_objects;
		}
	};

	xhttp.open('GET', 'https://raw.githubusercontent.com/udacity/Javascript/master/dino.json', true);
	xhttp.send();
})();



    // Create Dino Constructor
// TODO: add image source so that it can be modified later on
function Dino(species, weight, height, diet, where="", when="", fact="") {
	this.species = species;
	this.weight = weight;
	this.height = height;
	this.diet = diet;
	this.where = where;
	this.when = when;
	this.fact = fact;
}

//clean up comparisons - make sure that the differences are never equal or rounded to zero
//initially round to ONE decimal place, add more if necessary
    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 
Dino.prototype.compareWeight = function(other) {
	let weight_diff = Math.round((this.weight/other.weight) * 100)/100;
	if (weight_diff == 0)
		weight_diff = Math.round((this.weight/other.weight) * 1000)/1000;
	let compareWord = "more";
	if (weight_diff < 1) {
		weight_diff = Math.round((1/weight_diff) * 100)/100;
		compareWord = "less";
	}

	return this.species + ' has a weight about ' + weight_diff + ' times ' + compareWord + ' than ' + other.species + "."; 
};
    
    // Create Dino Compare Method 2
    // NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = function(other) {
	let height_diff = Math.round((this.height/other.height) * 100)/100;
	let compareWord = "taller";
	if (height_diff < 1) {
		height_diff = Math.round((1/height_diff) * 100)/100;
		compareWord = "shorter";
	}
	return this.species + ' is about ' + height_diff + ' times ' + compareWord + ' than ' + other.species + "."; 
};
    
    // Create Dino Compare Method 3
    // NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function(other) {
	const thisDiet = this.diet.toLowerCase();
	const otherDiet = other.diet.toLowerCase();
	if (thisDiet == otherDiet) {
		return 'Both ' + this.species + ' and ' + other.species + ' are ' + thisDiet + "s.";
	}

	return 'While ' + other.species + ' is a ' + otherDiet + ', the dinosaur ' + this.species + ' is a ' + thisDiet + '.';
}

    // Create Dino Objects

    // Create Human Object


    // Use IIFE to get human data from form
document.getElementById('btn').addEventListener('click', (function(ev) {
	let human = {};
	return function() {
		let human_name = document.getElementById('name').value;
		//TODO: check for invalid input
		let human_feet = parseInt(document.getElementById('feet').value);
		let human_inches = parseInt(document.getElementById('inches').value);
		let human_height = (human_feet*12) + human_inches;
		let human_weight = parseInt(document.getElementById('weight').value);
		let human_diet = document.getElementById('diet').value;
		human = new Dino(human_name, human_weight, human_height, human_diet);
		loadInfoGraphic(human);
	};
})());

function loadInfoGraphic(object) {
    // Generate Tiles for each Dino in Array
	var grid = document.getElementById('grid');
	dino_objects.forEach(function(data) {
		var newDiv = document.createElement('div');
		newDiv.className = 'grid-item';
		newDiv.style.fontSize = '20px';
		newDiv.innerHTML += '<strong style="font-size: 40px;">' + data.species + '</strong><br />';
		newDiv.innerHTML += '<img src="images/' + data.species.toLowerCase() + '.png" />';
		newDiv.innerHTML += data.compareWeight(object) + '<br /><br />';
		newDiv.innerHTML += data.compareHeight(object) + '<br /><br />';
		newDiv.innerHTML += data.compareDiet(object) + '<br /><br />';
		grid.appendChild(newDiv);
	});
        // Add tiles to DOM

    // Remove form from screen
    document.body.removeChild(document.getElementById('dino-compare'));
}

// On button click, prepare and display infographic

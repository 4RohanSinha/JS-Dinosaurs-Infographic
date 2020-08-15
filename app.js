//array of all dino objects - all json data has to be put through the Dino constructor function so that compare methods can be used
let dino_objects = {};

//immediately-invoked function expression to get dino data from dino.json (on the github repository) using AJAX
//source for ajax tutorial: https://www.w3schools.com/js/js_json_http.asp
dino_objects = (function() {
	let xhttp = new XMLHttpRequest();
	let data = {};
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			data = JSON.parse(this.responseText);
			console.log(data.Dinos);
			dino_objects = data.Dinos.map((data) => new Dino(data.species, data.weight, data.height, data.height, data.diet, data.where, data.when, data.fact));
			//TODO: get rid of console.log
			return dino_objects;
		}
	};

	xhttp.open('GET', 'https://raw.githubusercontent.com/udacity/Javascript/master/dino.json', true);
	xhttp.send();
})();



    // Create Dino Constructor
function Dino(species, weight, height, diet, where="", when="", fact="") {
	this.species = species;
	this.weight = weight;
	this.height = height;
	this.diet = diet;
	this.where = where;
	this.when = when;
	this.fact = fact;
}

    // Create Dino Objects

    // Create Human Object


    // Use IIFE to get human data from form
document.getElementById('btn').addEventListener('click', (function(ev) {
	let human = {};
	return function() {
		let human_name = document.getElementById('name').value;
		let human_feet = parseInt(document.getElementById('feet').value);
		let human_inches = parseInt(document.getElementById('inches').value);
		let human_height = (human_feet*12) + human_inches;
		let human_weight = parseInt(document.getElementById('weight').value);
		let human_diet = document.getElementById('diet').value;
		human = new Dino(human_name, human_weight, human_height, human_diet);
		loadInfoGraphic(human);
	};
})());

    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 
Dino.prototype.compareWeight = function(other) {
	return this.species + ' has a weight ' + (this.weight/other.weight) + ' times more than ' + other.species; 
};
    
    // Create Dino Compare Method 2
    // NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = function(other) {
	return this.species + ' is ' + (this.height/other.height) + ' times taller than ' + other.species; 
};
    
    // Create Dino Compare Method 3
    // NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function(other) {
	return 'While ' + other.species + ' is a ' + other.diet + ', the dinosaur ' + this.species + ' is a ' + this.diet + '.';
}

function loadInfoGraphic(object) {
    // Generate Tiles for each Dino in Array
	dino_objects.forEach(function(data) {
		console.log(data);
		console.log(data.compareWeight(object));
		console.log(data.compareHeight(object));
	});
        // Add tiles to DOM

    // Remove form from screen

}

// On button click, prepare and display infographic

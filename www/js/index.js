var overview;
var grid;
var imageHandler;
var filePicker;
var backButtonFunctionPointer = function () {};

function backButtonFunction() {
	backButtonFunctionPointer();
}

function errorCallback(error) {
	console.log(error);
	alert('ERROR: ' + error.code);
}

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	document.getElementById('edit-button').addEventListener('click', function () {
		loadNewPokemon();
	});
	overview = new pokemonOverview();
	imageHandler = new ImageHandler();

	loadDex(function () {
		grid = new PokemonGrid();
	});
	document.addEventListener('backbutton', function () {}, false);
	document.addEventListener('pause', saveDex, false);

	document.body.addEventListener('long-press', function (e) {
		grid.switchEditing();
	});

	if (canUpdate()) {
		getAppVersion();
		update();
	}

	document.addEventListener(
		'backbutton',
		function () {
			backButtonFunction();
		},
		false
	);
}

function roundToPlace(number, place) {
	const factor = Math.pow(10, place);
	return Math.round(number * factor) / factor;
}

Array.prototype.move = function (from, to) {
	this.splice(to, 0, this.splice(from, 1)[0]);
};

function array_move(arr, old_index, new_index) {
	if (new_index >= arr.length) {
		var k = new_index - arr.length + 1;
		while (k--) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr; // for testing
}

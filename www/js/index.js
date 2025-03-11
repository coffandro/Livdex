var overview;
var grid;
var imageHandler;
var filePicker;

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
		pokedex = pokemonData;
		grid = new PokemonGrid(pokemonData);
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
}

function roundToPlace(number, place) {
	const factor = Math.pow(10, place);
	return Math.round(number * factor) / factor;
}

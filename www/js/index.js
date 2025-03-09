var overview;
var grid;
var imageHandler;

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	// document.getElementById("edit-button").addEventListener("click", switchEditMode);
	overview = new pokemonOverview();
	imageHandler = new ImageHandler();

	loadDex(function () {
		pokedex = pokemonData;
		grid = new PokemonGrid(pokemonData);
	});
	document.addEventListener('backbutton', function () {}, false);
	document.addEventListener('pause', saveDex, false);
}

function roundToPlace(number, place) {
	const factor = Math.pow(10, place);
	return Math.round(number * factor) / factor;
}

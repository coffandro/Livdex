var overview;
var grid;
var imageHandler;

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	// document.getElementById("edit-button").addEventListener("click", switchEditMode);
	overview = new pokemonOverview();
	imageHandler = new ImageHandler();

	loadDex(function () {
		grid = new PokemonGrid(pokemonData);
	});
	document.addEventListener('backbutton', function () {}, false);
}

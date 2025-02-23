document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	loadDex(function() {
		console.log(pokemonData);
	});
}
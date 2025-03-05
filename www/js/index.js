var overview

document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	// document.getElementById("edit-button").addEventListener("click", switchEditMode);
	overview = new pokemonOverview();

	loadDex(function() {
		applyDex(pokemonData);
	});
	document.addEventListener("backbutton", function() {}, false);
}

function loadImageFromFile(filename, _callback) {
	window.resolveLocalFileSystemURL(filename, function success(fileEntry) {
		fileEntry.file(function (file) {
			var reader = new FileReader();
			reader.onloadend = function() {
				if (this.result) {
					var blob = new Blob([new Uint8Array(this.result)], { type: "image/png" });
					_callback(window.URL.createObjectURL(blob));
				}
			};
			reader.readAsArrayBuffer(file);
		});
	}, errorCallback);
}
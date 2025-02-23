document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
	loadDex(function() {
		applyDex(pokemonData);
	});
}

function loadImageFromFile(filename, _callback) {
	console.log(filename);
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
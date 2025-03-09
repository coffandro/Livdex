class ImageHandler {
	constructor() {
		this.images = {};
	}

	loadImageFromFile(filename, _callback = null, _passthroughArgs = []) {
		if (imageHandler.images[filename] != undefined) {
			if (_callback != undefined) {
				_callback(
					window.URL.createObjectURL(imageHandler.images[filename]),
					_passthroughArgs
				);
			}
		} else {
			window.resolveLocalFileSystemURL(
				filename,
				function success(fileEntry) {
					fileEntry.file(function (file) {
						var reader = new FileReader();
						reader.onloadend = function () {
							if (this.result) {
								var blob = new Blob([new Uint8Array(this.result)], {
									type: 'image/png',
								});

								imageHandler.images[filename] = blob;

								if (_callback != undefined) {
									_callback(window.URL.createObjectURL(blob), _passthroughArgs);
								}
							}
						};
						reader.readAsArrayBuffer(file);
					});
				},
				errorCallback
			);
		}
	}
}

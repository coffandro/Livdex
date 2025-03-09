class ImageHandler {
	constructor() {
		this.images = {};
	}

	loadImageFromFile(filename, refresh = false, _callback = null, _passthroughArgs = []) {
		if (imageHandler.images[filename] == undefined || refresh) {
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

								console.log(filename);

								imageHandler.images[filename] = blob;

								if (_callback != null) {
									_callback(window.URL.createObjectURL(blob), _passthroughArgs);
								}
							}
						};
						reader.readAsArrayBuffer(file);
					});
				},
				errorCallback
			);
		} else {
			if (_callback != null) {
				_callback(
					window.URL.createObjectURL(imageHandler.images[filename]),
					_passthroughArgs
				);
			}
		}
	}

	copyFile(baseFileURI, destPathName, returnCallback = null) {
		var type = window.PERSISTENT;
		var size = 5 * 1024 * 1024;

		window.resolveLocalFileSystemURL(
			baseFileURI,
			function (file) {
				window.requestFileSystem(
					type,
					size,
					function (fileSystem) {
						var documentsPath = fileSystem.root;

						file.copyTo(
							documentsPath,
							destPathName,
							function (res) {
								if (returnCallback != null) {
									returnCallback(null);
								}
							},
							function (error) {
								if (returnCallback != null) {
									returnCallback(error);
								}
							}
						);
					},
					errorCallback
				);
			},
			errorCallback
		);
	}
}

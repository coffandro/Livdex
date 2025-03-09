class ImageHandler {
	constructor() {
		this.images = {};
	}

	loadImageFromFile(filename, _callback = null, _passthroughArgs = []) {
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

							if (imageHandler.images[filename] == blob) {
								if (_callback != undefined) {
									_callback(
										window.URL.createObjectURL(imageHandler.images[filename]),
										_passthroughArgs
									);
								}
							} else {
								imageHandler.images[filename] = blob;

								if (_callback != undefined) {
									_callback(window.URL.createObjectURL(blob), _passthroughArgs);
								}
							}
						}
					};
					reader.readAsArrayBuffer(file);
				});
			},
			errorCallback
		);
	}

	copyFile(baseFileURI, destPathName, fileSystem = LocalFileSystem.PERSISTENT) {
		var size = 5 * 1024 * 1024;

		window.resolveLocalFileSystemURL(
			baseFileURI,
			function (file) {
				window.requestFileSystem(
					fileSystem,
					size,
					function (fileSystem) {
						var documentsPath = fileSystem.root;
						console.log(documentsPath);
						file.copyTo(
							documentsPath,
							destPathName,
							function (res) {
								console.log('copying was successful to: ' + res.nativeURL);
							},
							errorCallback
						);
					},
					errorCallback
				);
			},
			errorCallback
		);
	}
}

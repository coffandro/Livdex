function errorCallback(error) {
	alert('ERROR: ' + error.code);
}

function listDir(path) {
	var type = window.PERSISTENT;
	var size = 5 * 1024 * 1024;
	window.requestFileSystem(type, size, successCallback, errorCallback);

	function successCallback(fs) {
		fs.root.getDirectory(
			path,
			{ create: false, exclusive: false },
			function (dirEntry) {
				var directoryReader = dirEntry.createReader();
				directoryReader.readEntries(function (entries) {
					var Files = [];
					for (var i = 0; i < entries.length; i++) {
						if (entries[i].name != undefined) {
							Files.push(entries[i].name);
						}
					}
					return Files;
				}, errorCallback);
			},
			errorCallback
		);
	}
}

function loadImageFromFile(filename, _callback) {
	window.resolveLocalFileSystemURL(
		filename,
		function success(fileEntry) {
			fileEntry.file(function (file) {
				var reader = new FileReader();
				reader.onloadend = function () {
					if (this.result) {
						var blob = new Blob([new Uint8Array(this.result)], { type: 'image/png' });
						_callback(window.URL.createObjectURL(blob));
					}
				};
				reader.readAsArrayBuffer(file);
			});
		},
		errorCallback
	);
}

function writeFile(filename, content) {
	var type = window.PERSISTENT;
	var size = 5 * 1024 * 1024;
	window.requestFileSystem(type, size, successCallback, errorCallback);

	function successCallback(fs) {
		fs.root.getFile(
			filename,
			{ create: true },
			function (fileEntry) {
				fileEntry.createWriter(function (fileWriter) {
					fileWriter.onwriteend = function (e) {
						alert('Write completed.');
					};

					fileWriter.onerror = function (e) {
						alert('Write failed: ' + e.toString());
					};

					var blob = new Blob([content], { type: 'text/plain' });
					fileWriter.write(blob);
				}, errorCallback);
			},
			errorCallback
		);
	}

	function errorCallback(error) {
		alert('ERROR: ' + error.code);
	}
}

function readFile(filename) {
	var type = window.PERSISTENT;
	var size = 5 * 1024 * 1024;
	window.requestFileSystem(type, size, successCallback, errorCallback);

	function successCallback(fs) {
		fs.root.getFile(
			filename,
			{},
			function (fileEntry) {
				fileEntry.file(function (file) {
					var reader = new FileReader();

					reader.onloadend = function (e) {
						alert(this.result);
					};
					reader.readAsText(file);
				}, errorCallback);
			},
			errorCallback
		);
	}

	function errorCallback(error) {
		alert('ERROR: ' + error.code);
	}
}

// Folder interactions

function createFolder(path) {
	var type = window.PERSISTENT;
	var size = 5 * 1024 * 1024;
	window.requestFileSystem(type, size, successCallback, errorCallback);

	function successCallback(fs) {
		fs.root.getDirectory(path, { create: true }, function (dirEntry) {}, errorCallback);
	}

	function errorCallback(error) {
		alert('ERROR: ' + error.code);
	}
}

function removeFolder(path) {
	var type = window.PERSISTENT;
	var size = 5 * 1024 * 1024;
	window.requestFileSystem(type, size, successCallback, errorCallback);

	function successCallback(fs) {
		fs.root.getDirectory(
			path,
			{ create: true },
			function (dirEntry) {
				function success(entry) {
					console.log('Removal of ', path, ' succeeded');
				}

				dirEntry.remove(success, errorCallback);
			},
			errorCallback
		);
	}

	function errorCallback(error) {
		alert('ERROR: ' + error.code);
	}
}

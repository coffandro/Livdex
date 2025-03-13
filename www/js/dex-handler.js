var pokemonData = {};

function loadNewPokemon() {
	var type = window.PERSISTENT;
	var size = 5 * 1024 * 1024;
	window.requestFileSystem(type, size, successCallback, errorCallback);

	function successCallback(fs) {
		fs.root.getDirectory(
			'Dex/Icons',
			{ create: false, exclusive: false },
			function (IconsDE) {
				window.resolveLocalFileSystemURL(
					cordova.file.applicationDirectory + 'www/assets/img',
					function (dirEntry) {
						dirEntry.getFile(
							'Pikachu.png',
							{ create: false, exclusive: false },
							function (file) {
								var newUUID = crypto.randomUUID();

								// Copy files from assets to system
								file.copyTo(
									IconsDE,
									newUUID + '.png',
									function (entry) {
										var newMon = {
											Name: 'Pikachu',
											Number: 25,
											Type1: 'Electric',
											Type2: '',
											Height: '0.4',
											Weight: '3.0',
											Ability: 'Static',
											hasGender: true,
											MGender: 50,
											FGender: 50,
											UUID: newUUID,
											HP: 35,
											Atk: 55,
											Def: 40,
											SpAtk: 50,
											SpDef: 50,
											Speed: 90,
											Line: {
												Pre2: '',
												Pre1: '',
												Post1: '',
												Post2: '',
											},
										};

										grid.addPokemon(newMon);
										pokemonData['Pokemon'].push(newMon);
										saveDex();
									},
									errorCallback
								);
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

function loadDex(_callback) {
	var type = window.PERSISTENT;
	var size = 5 * 1024 * 1024;
	window.requestFileSystem(type, size, successCallback, errorCallback);

	function successCallback(fs) {
		var directoryReader = fs.root.createReader();
		directoryReader.readEntries(function (entries) {
			var Files = [];
			for (var i = 0; i < entries.length; i++) {
				if (entries[i].name != undefined) {
					Files.push(entries[i].name);
				}
			}

			if (!Files.includes('Dex')) {
				loadDefaultDex(fs, function () {
					load(fs, _callback);
				});
			} else {
				load(fs, _callback);
			}
		}, errorCallback);
	}
}

function saveDex(_callback) {
	var type = window.PERSISTENT;
	var size = 5 * 1024 * 1024;
	window.requestFileSystem(type, size, successCallback, errorCallback);

	function successCallback(fs) {
		fs.root.getDirectory(
			'Dex',
			{ create: false, exclusive: false },
			function (dexDE) {
				save(dexDE, pokemonData);
			},
			errorCallback
		);
	}
}

function save(fs, data, _callback) {
	fs.getFile(
		'DexData.json',
		{ create: false, exclusive: false },
		function (fileEntry) {
			fileEntry.createWriter(function (fileWriter) {
				fileWriter.onwriteend = function (e) {
					if (_callback != null) {
						_callback();
					}
				};

				fileWriter.onerror = errorCallback;

				var blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
				fileWriter.write(blob);
			}, errorCallback);
		},
		errorCallback
	);
}

function load(fs, _callback) {
	fs.root.getDirectory(
		'Dex',
		{ create: false, exclusive: false },
		function (dexDE) {
			dexDE.getFile(
				'DexData.json',
				{ create: false, exclusive: false },
				function (dexFile) {
					dexFile.file(function (file) {
						var reader = new FileReader();

						reader.onloadend = function (e) {
							pokemonData = JSON.parse(this.result);

							if (_callback != undefined) {
								_callback();
							}
						};
						reader.readAsText(file);
					}, errorCallback);
				},
				errorCallback
			);
		},
		errorCallback
	);
}

function loadDefaultDex(fs, _callback) {
	// Create dex dir in system files
	fs.root.getDirectory(
		'Dex',
		{ create: true, exclusive: false },
		function (dexDE) {
			// Load DexData.json from assets to system files
			// First, we get the file
			window.resolveLocalFileSystemURL(
				cordova.file.applicationDirectory + 'www/assets/DefDex/DexData.json',
				function (fileEntry) {
					// Then we copy it to the location we want it
					fileEntry.copyTo(
						dexDE,
						'DexData.json',
						function (entry) {
							console.log(entry);
						},
						errorCallback
					);
				},
				errorCallback
			);

			// Open/Create and open the Icons folder inside Dex folder
			dexDE.getDirectory(
				'Icons',
				{ create: true, exclusive: false },
				function (IconsDE) {
					// Get the folder in the assets folder
					window.resolveLocalFileSystemURL(
						cordova.file.applicationDirectory + 'www/assets/DefDex/Icons',
						function (dirEntry) {
							// Iterate over files and send copy them over
							var directoryReader = dirEntry.createReader();
							directoryReader.readEntries(function (entries) {
								for (var i = 0; i < entries.length; i++) {
									if (entries[i].name != undefined) {
										// Copy files from assets to system
										entries[i].copyTo(
											IconsDE,
											entries[i].name,
											function (entry) {
												console.log(entry);
											},
											errorCallback
										);
									}
								}

								if (_callback != undefined) {
									_callback();
								}
							}, errorCallback);
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

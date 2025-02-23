var pokemonData = {}

function errorCallback(error) {
    alert("ERROR: " + error.code)
}

function loadDex(_callback) {
	var type = window.PERSISTENT;
    var size = 5*1024*1024;
    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {
        var directoryReader = fs.root.createReader();
        directoryReader.readEntries(function(entries) {
            var Files = [];
            for (var i=0; i < entries.length; i++) {
                if (entries[i].name != undefined) {
                    Files.push(entries[i].name);
                }
            }

            if (!Files.includes("Dex")) {
                loadDefaultDex(fs, function() {
                    load(fs, _callback);
                });
            } else {
                load(fs, _callback);
            }
        }, errorCallback);
    }
}

function load(fs, _callback) {
    fs.root.getDirectory("Dex", {create: false, exclusive: false}, function(dexDE) {
        dexDE.getFile("DexData.json", {create: false, exclusive: false}, function(dexFile) {
            dexFile.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    pokemonData = JSON.parse(this.result);

                    if (_callback != undefined) {
                        _callback();
                    }
                };
                reader.readAsText(file);
            }, errorCallback);
        }, errorCallback);
    }, errorCallback);
}

function loadDefaultDex(fs, _callback) {
    // Create dex dir in system files
    fs.root.getDirectory("Dex", {create: true, exclusive: false}, function(dexDE) {
        // Load DexData.json from assets to system files
        // First, we get the file
        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/assets/DefDex/DexData.json", function(fileEntry) {
            // Then we copy it to the location we want it
            fileEntry.copyTo(dexDE, "DexData.json", function(entry){console.log(entry)}, errorCallback);
        }, errorCallback);

        // Open/Create and open the Icons folder inside Dex folder
        dexDE.getDirectory("Icons", {create: true, exclusive: false}, function(IconsDE) {
            // Get the folder in the assets folder
            window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/assets/DefDex/Icons", function(dirEntry) {
                // Iterate over files and send copy them over
                var directoryReader = dirEntry.createReader();
                directoryReader.readEntries(function(entries) {
                    for (var i=0; i < entries.length; i++) {
                        if (entries[i].name != undefined) {
                            // Copy files from assets to system
                            entries[i].copyTo(IconsDE, entries[i].name, function(entry){console.log(entry)}, errorCallback);
                        }
                    }

                    if (_callback != undefined) {
                        _callback();
                    }
                }, errorCallback);

            }, errorCallback);
        }, errorCallback);
    }, errorCallback);	
}

function applyDex(dex, _callback) {
	var grid = document.getElementById("pokemon-grid");

	if (dex["Pokemon"] == undefined) {
		alert("dex pokemon is undefined");
		return;
	}
	
	dex["Pokemon"].forEach(pokemon => {
		var name = document.createElement("span");
		name.classList.add("pokemon-name");
		name.innerText = pokemon["Name"];

		var type1 = document.createElement("span");
		type1.classList.add("pokemon-type-1");
		type1.innerText = pokemon["Type1"];

		var type2 = document.createElement("span");
		type2.classList.add("pokemon-type-2");
		if (pokemon["Type2"] == "") {
			type2.classList.add("hidden");
		} else {
			type2.innerText = pokemon["Type2"];
		}
		

		var regional = document.createElement("span");
		regional.classList.add("pokemon-regional");
		if (pokemon["Regional"] == "") {
			regional.classList.add("hidden");
		} else {
			regional.innerText = pokemon["Regional"];
		}

		var image = document.createElement("img");
		image.classList.add("pokemon-image");
		loadImageFromFile(cordova.file.dataDirectory + "files/Dex/" + pokemon["IconPath"], function(source) {
			image.src = source
		})
		
		var button = document.createElement("div");
		button.classList.add(pokemon["Type1"])
		button.classList.add("pokemon-button");

		button.appendChild(name);
		button.appendChild(type1);
		button.appendChild(type2);
		button.appendChild(regional);
		button.appendChild(image);

		grid.appendChild(button)
	});

	if (_callback != undefined) {
		_callback();
	}
}
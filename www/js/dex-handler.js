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

                    _callback();
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

                    _callback();
                }, errorCallback);

            }, errorCallback);
        }, errorCallback);
    }, errorCallback);	

    // load(fs);
}
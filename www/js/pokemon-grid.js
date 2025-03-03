function switchEditMode() {
    document.body.classList.toggle("edit-mode");
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
		if (pokemon["Type1"] == "") {
			type1.classList.add("hidden");
		} else {
			type1.innerText = pokemon["Type1"];
		}

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
		
		if (pokemon["Type1"] != "") {
			button.classList.add(pokemon["Type1"])
		} else {
			button.classList.add("Normal");
		}
		button.classList.add("pokemon-button");
        button.addEventListener("click", function () {
            overview.openPokemon(pokemon)
        });

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
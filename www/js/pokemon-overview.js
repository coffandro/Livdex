class pokemonOverview  {
    constructor() {
        const swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            slidesPerView: 1,
            paginationClickable: true,
            loop: false,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                renderBullet: function (index, className) {
                    const tabs = ["About", "Stats", "Evolutions"]
                    return '<span class="' + className + '">' + (tabs[index]) + "</span>";
                },
            }
        });

        this.id = -1;
        
        this.grid = document.getElementById("pokemon-grid");
        this.gridTopbar = document.getElementById("grid-topbar");
        this.overview = document.getElementById("pokemon-overview");
        this.typeLabels = {};
        this.typeChecks = {};

        this.pokemonNameEntry = document.getElementById('overview-name-entry');
        this.pokemonImage = document.getElementById('overview-image');
        this.typeChecks = document.getElementsByClassName("typeCheckbox");
        this.typeLabels = document.getElementsByClassName("overview-type-label");

        this.height = document.getElementById('overview-height');
        this.weight = document.getElementById('overview-weight');
        this.number = document.getElementById('overview-number');
        this.gender = document.getElementById('overview-gender');
        this.genderMLabel = document.getElementById('overview-male-label');
        this.genderFLabel = document.getElementById('overview-female-label');
        this.genderCheck = document.getElementById('overview-gender-check');
        this.genderContainer = document.getElementById('overview-gender-container');

        this.ability = document.getElementById('overview-ability');
        this.abilityPrevText = "";

        this.saveInterval = null;

        this.ability.addEventListener('input', function(event) {
            if (overview.ability.offsetHeight > 59) {
                overview.ability.innerText = overview.abilityPrevText;
                const range = document.createRange();
                const selection = window.getSelection();
                range.setStart(overview.ability, overview.ability.childNodes.length);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                overview.abilityPrevText = overview.ability.innerText;
            }
        });

        this.pokemon = {};

        this.genderCheck.addEventListener("change", function() {
            overview.switchGender(this.checked);
        });

        this.typeContainer = document.getElementById('overview-type-container');
    }

    switchGender(isOn) {
        if (isOn) {
            this.genderCheck.checked = true;
            this.genderContainer.classList.remove("disabled");
            this.gender.disabled = false;
            if (this.pokemon != {}) {
                this.updatePokemonData();
            }
        } else {
            this.genderCheck.checked = false;
            this.genderContainer.classList.add("disabled");
            this.gender.disabled = true;
            this.genderMLabel.textContent = "";
            this.genderFLabel.textContent = "";
        }
    }

    updatePokemonData() {
        if (this.pokemon == {}) {
            return;
        }

        this.overview.classList.add(this.pokemon["Type1"])

        this.pokemonNameEntry.value = this.pokemon["Name"];
        
        // Hide current type labels by hidding all
        Array.from(this.typeLabels).forEach((value) => {
            value.classList.add("hidden");
        });

        // Disable current type checkboxes
        Array.from(this.typeChecks).forEach((value) => {
            value.checked = false;
        });

        this.gender.value = this.pokemon["MGender"];
        this.genderMLabel.textContent = String(this.pokemon["MGender"]) + "%";
        this.genderFLabel.textContent = String(this.pokemon["FGender"]) + "%";

        // Show type 1's label by removing hidden from it if it exists
        if (this.pokemon["Type1"] != "") {
            this.typeLabels.namedItem(this.pokemon["Type1"]).classList.remove("hidden");
            this.typeChecks.namedItem(this.pokemon["Type1"]).checked = true;
        }
        if (this.pokemon["Type2"] != "") {
            this.typeLabels.namedItem(this.pokemon["Type2"]).classList.remove("hidden");
            this.typeChecks.namedItem(this.pokemon["Type2"]).checked = true;
        }

        this.height.value = this.pokemon["Height"];
        this.weight.value = this.pokemon["Weight"];
        this.number.value = String(this.pokemon["Number"]).padStart(4, "0");
        this.ability.innerText = this.pokemon["Ability"];

        loadImageFromFile(cordova.file.dataDirectory + "files/Dex/" + this.pokemon["IconPath"], function(source) {
			overview.pokemonImage.src = source
		});
    }

    checkForSave() {
        var genderBoolChanged = (overview.genderCheck.checked != overview.pokemon["hasGender"]);
        var genderChanged;
        if (overview.genderCheck.checked) {
            genderChanged = (overview.gender.value != overview.pokemon["MGender"]);
        } else {
            genderChanged = false;
        }
        var nameChanged = (overview.pokemonNameEntry.value != overview.pokemon["Name"]);
        var numberChanged = (overview.number.value != overview.pokemon["Number"]);
        var abilityChanged = (overview.ability.innerText != overview.pokemon["Ability"]);
        var heightChanged = (overview.height.value != overview.pokemon["Height"]);
        var weightChanged = (overview.weight.value != overview.pokemon["Weight"]);
        if (genderBoolChanged || abilityChanged || genderChanged || nameChanged || numberChanged || heightChanged || weightChanged) {
            overview.savePokemon();
        }
    }

    savePokemon() {
        // Find this.pokemon in main pokemon dict, overwrite, save and update
        // {
		// 	"Name": "Cinderace",
		// 	"Number": 815,
		// 	"Type1": "Fire",
		// 	"Type2": "",
		// 	"Height": "1.4",
		// 	"Weight": "33.0",
		// 	"Ability": "Blaze",
		// 	"hasGender": true,
		// 	"MGender": 87.5,
		// 	"FGender": 12.5,
		// 	"IconPath": "Icons/Cinderace.png"
		// },

        var data = {}

        data["Name"] = overview.pokemonNameEntry.value;
        data["Number"] = overview.number.value;
        data["Type1"] = overview.pokemon["Type1"];
        data["Type2"] = overview.pokemon["Type2"];
        data["Height"] = overview.height.value;
        data["Weight"] = overview.weight.value;
        data["Ability"] = overview.ability.innerText;
        data["hasGender"] = overview.genderCheck.checked;
        data["MGender"] = overview.gender.value;
        data["FGender"] = 100 - overview.gender.value;
        data["IconPath"] = overview.pokemon["IconPath"];

        pokemonData["Pokemon"][overview.id] = data;

        console.log(pokemonData["Pokemon"]);

        // pokemonData["Pokemon"][id].forEach((element, index) => {
            // if (index == id) {
                // pokemonData["Pokemon"][index]
            // }
        // });

        this.updatePokemonData();
    }

    openPokemon(pokemon, id) {
        this.pokemon = pokemon;
        this.id = id;

        this.grid.classList.add("hidden");
        this.gridTopbar.classList.add("hidden");
        this.overview.classList.remove("hidden");

        this.updatePokemonData();

        if (this.pokemon["hasGender"]) {
            this.switchGender(true);
        } else {
            this.switchGender(false);
        }

        this.saveInterval = setInterval(this.checkForSave, 2500);

        document.addEventListener("backbutton", function() {overview.closePokemon();}, false);
    }

    closePokemon() {
        this.grid.classList.remove("hidden");
        this.gridTopbar.classList.remove("hidden");
        this.overview.classList.add("hidden");

        this.overview.classList.remove(this.pokemon["Type1"])

        if (this.saveInterval != null) {
            clearInterval(this.saveInterval);
        }

        this.checkForSave();

        this.pokemon = {};
        this.id = -1;

        document.addEventListener("backbutton", function() {}, false);
    }
}
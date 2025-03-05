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

        this.ability.addEventListener('input', function(event) {
            console.log(overview.ability.offsetHeight);
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
        } else {
            this.genderCheck.checked = false;
            this.genderContainer.classList.add("disabled");
            this.gender.disabled = true;
        }
    }

    openPokemon(pokemon) {
        this.pokemon = pokemon;

        this.grid.classList.add("hidden");
        this.gridTopbar.classList.add("hidden");
        this.overview.classList.remove("hidden");

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

        if (this.pokemon["hasGender"]) {
            this.switchGender(true);
            this.gender.value = this.pokemon["MGender"];
            this.genderMLabel.textContent = String(this.pokemon["MGender"]) + "%";
            this.genderFLabel.textContent = String(this.pokemon["FGender"]) + "%";
        } else {
            this.switchGender(false);
        }

        loadImageFromFile(cordova.file.dataDirectory + "files/Dex/" + pokemon["IconPath"], function(source) {
			overview.pokemonImage.src = source
		});

        document.addEventListener("backbutton", function() {overview.closePokemon();}, false);
    }

    closePokemon() {
        this.grid.classList.remove("hidden");
        this.gridTopbar.classList.remove("hidden");
        this.overview.classList.add("hidden");

        this.overview.classList.remove(this.pokemon["Type1"])

        this.pokemon = null;

        document.addEventListener("backbutton", function() {}, false);
    }
}
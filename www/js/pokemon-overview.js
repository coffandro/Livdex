class pokemonOverview  {
    constructor() {
        this.grid = document.getElementById("pokemon-grid");
        this.gridTopbar = document.getElementById("grid-topbar");
        this.overview = document.getElementById("pokemon-overview");

        this.entries = [];
        this.labels = [];
        this.typeLabels = {};

        this.pokemonNameEntry = document.getElementById('overview-name-entry');

        this.pokemonImage = document.getElementById('overview-image');	

        this.typeLabels = document.getElementsByClassName("overview-type-label");

        this.pokemon = {};

        this.nameCheckBox = document.getElementById('toggleNameInput');
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

        // Show type 1's label by removing hidden from it if it exists
        if (this.pokemon["Type1"] != "") {
            this.typeLabels.namedItem(this.pokemon["Type1"]).classList.remove("hidden");
        }
        if (this.pokemon["Type2"] != "") {
            this.typeLabels.namedItem(this.pokemon["Type2"]).classList.remove("hidden");
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
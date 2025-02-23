class pokemonOverview  {
    constructor() {
        this.grid = document.getElementById("pokemon-grid");
        this.gridTopbar = document.getElementById("grid-topbar");
        this.overview = document.getElementById("pokemon-overview");

        this.pokemonNameEntry = document.getElementById("overview-name-entry");
        this.pokemonNameLabel = document.getElementById('overview-name-label');	
        this.pokemon = {};

        this.checkBox = document.getElementById('toggleInput');

        this.pokemonNameEntry.addEventListener("input", function(e) {
            overview.pokemonNameLabel.innerHTML = e.target.value;
        });

        this.checkBox.addEventListener('change', function() {
            if (overview.checkBox.checked) {
                overview.pokemonNameEntry.style.display = 'block';
                overview.pokemonNameLabel.style.display = 'none';
            } else {
                overview.pokemonNameEntry.style.display = 'none';
                overview.pokemonNameLabel.style.display = 'block';
            }
	    });
    }

    openPokemon(pokemon) {
        this.pokemon = pokemon;

        this.grid.classList.add("hidden");
        this.gridTopbar.classList.add("hidden");
        this.overview.classList.remove("hidden");

        this.overview.classList.add(this.pokemon["Type1"])

        if (this.pokemon["Regional"] != "") {
            this.pokemonNameLabel.innerHTML = this.pokemon["Regional"] + "-" + this.pokemon["Name"];
            this.pokemonNameEntry.value = this.pokemon["Regional"] + "-" + this.pokemon["Name"];
        } else {
            this.pokemonNameLabel.innerHTML = this.pokemon["Name"];
            this.pokemonNameEntry.value = this.pokemon["Name"];
        }

        document.addEventListener("backbutton", function() {overview.closePokemon();}, false);
    }

    closePokemon() {
        this.grid.classList.remove("hidden");
        this.gridTopbar.classList.remove("hidden");
        this.overview.classList.add("hidden");

        this.overview.classList.remove(this.pokemon["Type1"])

        this.pokemonNameLabel.innerHTML = "";

        document.addEventListener("backbutton", function() {navigator.app.exitApp();}, false);
    }
}
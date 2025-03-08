function switchEditMode() {
    document.body.classList.toggle("edit-mode");
}

class PokemonGrid {
	constructor(dex) {
		this.tiles = [];

		var grid = document.getElementById("pokemon-grid");
	
		if (dex["Pokemon"] == undefined) {
			alert("dex pokemon is undefined");
			return;
		}
		
		dex["Pokemon"].forEach((pokemon, index) => {
			var tile = new PokemonTile(pokemon, index)
			this.tiles.push(tile);
	
			grid.appendChild(tile)
		});
	}

	updatePokemonData(index, pokemon) {
		var tile = this.tiles[index];
		console.log(tile);
		tile.setData(pokemon, index);
	}
}

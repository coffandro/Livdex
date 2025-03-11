function switchEditMode() {
	document.body.classList.toggle('edit-mode');
}

class PokemonGrid {
	constructor(dex) {
		this.tiles = [];
		this.editing = false;

		this.grid = document.getElementById('pokemon-grid');

		if (dex['Pokemon'] == undefined) {
			alert('dex pokemon is undefined');
			return;
		}

		dex['Pokemon'].forEach((pokemon, index) => {
			var tile = new PokemonTile(pokemon, index);
			this.tiles.push(tile);

			this.grid.appendChild(tile);
		});
	}

	addPokemon(pokemon) {
		var tile = new PokemonTile(pokemon, this.tiles.length);
		this.tiles.push(tile);

		this.grid.appendChild(tile);
	}

	deletePokemon(index) {
		this.tiles[index].remove();
		this.tiles[index] = null;
		pokemonData['Pokemon'].splice(index, 1);
		saveDex();
	}

	updatePokemonData(index, pokemon) {
		var tile = this.tiles[index];

		tile.setData(pokemon, index);
	}

	switchEditing(bool = null) {
		if (bool != null) {
			if (typeof bool == 'boolean') {
				this.editing = bool;
			} else {
				return;
			}
		} else {
			this.editing = !this.editing;
		}

		if (this.editing) {
			Array.from(this.tiles).forEach(function (tile) {
				tile.enableEdit();
			});
		} else {
			Array.from(this.tiles).forEach(function (tile) {
				tile.disableEdit();
			});
		}
	}
}

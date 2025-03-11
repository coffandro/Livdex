class PokemonGrid {
	constructor(dex) {
		this.tiles = [];
		this.editing = false;
		this.deletionIndex = -1;

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

	promptPokemonDeletion(index) {
		if (this.tiles[index] != null) {
			this.deletionIndex = index;

			navigator.notification.confirm(
				'Are you sure you want to delete your ' + this.tiles[index].pokemon['Name'],
				this.deletePokemonConfirmCallback.bind(this),
				'Deletion confirmation'
			);
		}
	}

	deletePokemonConfirmCallback(buttonIndex) {
		if (this.deletionIndex != -1 && buttonIndex == 1) {
			this.deletePokemon(this.deletionIndex);
			this.deletionIndex = -1;
		}
	}

	deletePokemon(index) {
		if (this.tiles[index] != null) {
			this.tiles[index].remove();
			this.tiles[index] = null;
			pokemonData['Pokemon'].splice(index, 1);
			saveDex();
		}
	}

	updatePokemonData(index, pokemon) {
		if (this.tiles[index] != null) {
			this.tiles[index].setData(pokemon, index);
		}
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
				if (tile != null) {
					tile.enableEdit();
				}
			});
			document.addEventListener(
				'backbutton',
				function () {
					this.switchEditing(false);
				}.bind(this),
				false
			);
			//document.addEventListener('backbutton', grid.switchEditing(false), false);
		} else {
			Array.from(this.tiles).forEach(function (tile) {
				if (tile != null) {
					tile.disableEdit();
				}
			});
			document.addEventListener('backbutton', function () {}, false);
		}
	}
}

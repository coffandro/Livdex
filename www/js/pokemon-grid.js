class PokemonGrid {
	constructor() {
		this.tiles = [];
		this.editing = false;
		this.deletionIndex = -1;

		this.grid = document.getElementById('pokemon-grid');

		if (pokemonData['Pokemon'] == undefined) {
			alert('dex pokemon is undefined');
			return;
		}

		var filtered = pokemonData['Pokemon'].filter(function (el) {
			return el != null || el != undefined;
		});

		filtered.forEach((pokemon, index) => {
			if (pokemon != null) {
				var tile = new PokemonTile(pokemon, index);
				this.tiles.push(tile);

				this.grid.appendChild(tile);
			}
		});

		if (filtered != pokemonData['Pokemon']) {
			console.log('Changed data from' + pokemonData['Pokemon'] + ' to ' + filtered);
			pokemonData['Pokemon'] = filtered;
			saveDex();
		}
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

	movePokemon(index, direction) {
		var current = this.tiles[index];
		var next = this.tiles[index].nextElementSibling;
		var prev = this.tiles[index].previousElementSibling;

		if (direction == 1) {
			current.parentNode.insertBefore(current, next.nextElementSibling);
		} else if (direction == -1) {
			current.parentNode.insertBefore(current, prev);
		}

		pokemonData['Pokemon'] = array_move(pokemonData['Pokemon'], index, index + direction);
		saveDex();

		this.sortPokemon();
	}

	sortPokemon() {
		this.tiles = [];
		Array.from(this.grid.children).forEach((element, index) => {
			element.id = index;
			element.setAttribute('id', index);
			this.tiles.push(element);
		});
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

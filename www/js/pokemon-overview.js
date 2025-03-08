class pokemonOverview {
	constructor() {
		const swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
			slidesPerView: 1,
			paginationClickable: true,
			loop: false,
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
				renderBullet: function (index, className) {
					const tabs = ['About', 'Stats', 'Evolutions'];
					return '<span class="' + className + '">' + tabs[index] + '</span>';
				},
			},
		});

		this.id = -1;

		this.grid = document.getElementById('pokemon-grid');
		this.gridTopbar = document.getElementById('grid-topbar');
		this.overview = document.getElementById('pokemon-overview');

		this.pokemonNameEntry = document.getElementById('overview-name-entry');
		this.pokemonImage = document.getElementById('overview-image');
		this.typeChecks = document.getElementsByClassName('typeCheckbox');
		this.typeLabels = document.getElementsByClassName('overview-type-label');

		this.height = document.getElementById('overview-height');
		this.weight = document.getElementById('overview-weight');
		this.number = document.getElementById('overview-number');
		this.gender = document.getElementById('overview-gender');
		this.genderMLabel = document.getElementById('overview-male-label');
		this.genderFLabel = document.getElementById('overview-female-label');
		this.genderCheck = document.getElementById('overview-gender-check');
		this.genderContainer = document.getElementById('overview-gender-container');

		this.ability = document.getElementById('overview-ability');
		this.abilityPrevText = '';

		this.saveInterval = null;

		this.ability.addEventListener(
			'input',
			function (event) {
				if (this.ability.offsetHeight > 59) {
					this.ability.innerText = this.abilityPrevText;
					const range = document.createRange();
					const selection = window.getSelection();
					range.setStart(this.ability, this.ability.childNodes.length);
					range.collapse(true);
					selection.removeAllRanges();
					selection.addRange(range);
				} else {
					this.abilityPrevText = this.ability.innerText;
				}
			}.bind(this)
		);

		this.pokemon = {};

		this.genderCheck.addEventListener(
			'change',
			function () {
				this.switchGender(this.genderCheck.checked);
			}.bind(this)
		);

		this.gender.addEventListener(
			'input',
			function (event) {
				//this.pokemon["MGender"] = Math.round(event.target.value);
				//this.pokemon["FGender"] = Math.round(100 - event.target.value);
				this.gender.value = Math.round(event.target.value);
				this.genderMLabel.textContent = String(Math.round(event.target.value)) + '%';
				this.genderFLabel.textContent = String(Math.round(100 - event.target.value)) + '%';
			}.bind(this)
		);

		Array.from(this.typeChecks).forEach(
			function (currentCheck) {
				currentCheck.addEventListener('change', function () {
					var index = Array.from(overview.typeChecks).indexOf(this);

					if (this.checked) {
						overview.typeLabels[index].classList.remove('hidden');
					} else {
						overview.typeLabels[index].classList.add('hidden');
					}

					var checkedAmount = 0;

					Array.from(overview.typeChecks).forEach(function (check) {
						if (check.checked) {
							checkedAmount += 1;
						}
					});

					console.log(checkedAmount);

					if (checkedAmount > 1) {
						Array.from(overview.typeChecks).forEach(function (check) {
							if (!check.checked) {
								check.disabled = true;
							}
						});
					} else {
						Array.from(overview.typeChecks).forEach(function (check) {
							check.disabled = false;
						});
					}
				});
			}.bind(this)
		);

		this.typeContainer = document.getElementById('overview-type-container');
	}

	switchGender(isOn) {
		if (isOn) {
			this.genderCheck.checked = true;
			this.genderContainer.classList.remove('disabled');
			this.gender.disabled = false;
			this.pokemon['MGender'] = 50;
			this.pokemon['FGender'] = 50;
			this.gender.value = this.pokemon['MGender'];
			if (this.pokemon != {}) {
				this.updatePokemonData();
			}
		} else {
			this.genderCheck.checked = false;
			this.genderContainer.classList.add('disabled');
			this.gender.disabled = true;
			this.genderMLabel.textContent = '';
			this.genderFLabel.textContent = '';
		}
	}

	updatePokemonData() {
		if (this.pokemon == {} || this.pokemon == undefined || this.pokemon == null) {
			return;
		}

		this.overview.classList.add(this.pokemon['Type1']);

		this.pokemonNameEntry.value = this.pokemon['Name'];

		// Hide current type labels by hidding all
		Array.from(this.typeLabels).forEach((label) => {
			label.classList.add('hidden');
		});

		// Disable current type checkboxes
		Array.from(this.typeChecks).forEach((check) => {
			check.checked = false;
		});

		this.gender.value = this.pokemon['MGender'];
		if (this.genderCheck.checked) {
			this.genderMLabel.textContent = String(this.pokemon['MGender']) + '%';
			this.genderFLabel.textContent = String(this.pokemon['FGender']) + '%';
		}

		// Show type 1's label by removing hidden from it if it exists
		if (this.pokemon['Type1'] != '') {
			this.typeLabels.namedItem(this.pokemon['Type1']).classList.remove('hidden');
			this.typeChecks.namedItem(this.pokemon['Type1']).checked = true;
		}
		if (this.pokemon['Type2'] != '') {
			this.typeLabels.namedItem(this.pokemon['Type2']).classList.remove('hidden');
			this.typeChecks.namedItem(this.pokemon['Type2']).checked = true;
		}

		this.height.value = this.pokemon['Height'];
		this.weight.value = this.pokemon['Weight'];
		this.number.value = String(this.pokemon['Number']).padStart(4, '0');
		this.ability.innerText = this.pokemon['Ability'];

		loadImageFromFile(
			cordova.file.dataDirectory + 'files/Dex/' + this.pokemon['IconPath'],
			function (source) {
				this.pokemonImage.src = source;
			}.bind(this)
		);
	}

	checkForSave() {
		var genderBoolChanged = this.genderCheck.checked != this.pokemon['hasGender'];
		if (this.genderCheck.checked) {
			var genderChanged = this.gender.value != this.pokemon['MGender'];
		} else {
			var genderChanged = false;
		}
		var nameChanged = this.pokemonNameEntry.value != this.pokemon['Name'];
		var numberChanged = this.number.value != this.pokemon['Number'];
		var abilityChanged = this.ability.innerText != this.pokemon['Ability'];
		var heightChanged = this.height.value != this.pokemon['Height'];
		var weightChanged = this.weight.value != this.pokemon['Weight'];
		//console.log(this.genderCheck.checked, genderBoolChanged, abilityChanged, genderChanged, nameChanged, numberChanged, heightChanged, weightChanged);
		if (
			genderBoolChanged ||
			abilityChanged ||
			genderChanged ||
			nameChanged ||
			numberChanged ||
			heightChanged ||
			weightChanged
		) {
			this.savePokemon();
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

		var data = this.pokemon;

		data['Name'] = this.pokemonNameEntry.value;
		data['Number'] = this.number.value;
		data['Type1'] = this.pokemon['Type1'];
		data['Type2'] = this.pokemon['Type2'];
		data['Height'] = this.height.value;
		data['Weight'] = this.weight.value;
		data['Ability'] = this.ability.innerText;
		data['hasGender'] = this.genderCheck.checked;
		if (this.genderCheck.checked) {
			data['MGender'] = Math.round(this.gender.value);
			data['FGender'] = Math.round(100 - this.gender.value);
		} else {
			data['MGender'] = this.pokemon['MGender'];
			data['FGender'] = this.pokemon['FGender'];
		}
		data['IconPath'] = this.pokemon['IconPath'];

		pokemonData['Pokemon'][this.id] = data;
		this.pokemon = data;

		this.updatePokemonData();
		grid.updatePokemonData(this.id, this.pokemon);
	}

	openPokemon(pokemon, id) {
		this.pokemon = pokemon;
		this.id = id;

		this.grid.classList.add('hidden');
		this.gridTopbar.classList.add('hidden');
		this.overview.classList.remove('hidden');

		this.updatePokemonData();

		if (this.pokemon['hasGender']) {
			this.switchGender(true);
		} else {
			this.switchGender(false);
		}

		this.pokemon['MGender'] = pokemon['MGender'];
		this.pokemon['FGender'] = pokemon['FGender'];
		this.gender.value = this.pokemon['MGender'];

		this.saveInterval = setInterval(this.checkForSave.bind(this), 2500);

		document.addEventListener(
			'backbutton',
			function () {
				overview.closePokemon();
			}.bind(this),
			false
		);
	}

	closePokemon() {
		this.grid.classList.remove('hidden');
		this.gridTopbar.classList.remove('hidden');
		this.overview.classList.add('hidden');

		this.overview.classList.remove(this.pokemon['Type1']);

		if (this.saveInterval != null) {
			clearInterval(this.saveInterval);
		}

		this.checkForSave();

		// this.pokemon = {};
		// this.id = -1;

		document.addEventListener('backbutton', function () {}, false);
	}
}

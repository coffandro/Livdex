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
		this.typeMenuCheck = document.getElementById('toggleTypeMenu');

		this.ability = document.getElementById('overview-ability');
		this.abilityPrevText = '';

		this.saveInterval = null;

		this.pokemonImage.addEventListener('click', function () {
			cordova.wavemaker.filePicker.selectImage(
				false, // to select multiple images
				function (selectedFilePaths) {
					console.log(overview.pokemon['IconPath']);
					imageHandler.copyFile(
						selectedFilePaths[0],
						'Dex/' + overview.pokemon['IconPath'],
						function (status) {
							if (status != null) {
								return;
							}

							imageHandler.loadImageFromFile(
								cordova.file.dataDirectory +
									'files/Dex/' +
									overview.pokemon['IconPath'],
								true,
								function (source) {
									overview.pokemonImage.src = source;
								}
							);
						}
					);
				},
				function (error) {
					// handle error
				}
			);
			// navigator.camera.getPicture(
			// 	function (uri) {
			// 		console.log(uri);
			// 		imageHandler.copyFile(
			// 			uri,
			// 			'Dex/' + overview.pokemon['IconPath'],
			// 			function (status) {
			// 				console.log(status);
			// 				if (status == null) {
			// 					return;
			// 				}
			// 				imageHandler.loadImageFromFile(
			// 					cordova.file.dataDirectory +
			// 						'files/Dex/' +
			// 						overview.pokemon['IconPath'],
			// 					false,
			// 					function (source) {
			// 						overview.pokemonImage.src = source;
			// 					}
			// 				);
			// 			}
			// 		);
			// 	},
			// 	function () {},
			// 	{
			// 		destinationType: Camera.DestinationType.FILE_URI,
			// 		mediaType: Camera.MediaType.PICTURE,
			// 		sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
			// 		encodingType: Camera.EncodingType.PNG,
			// 	}
			// );
		});

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
				//this.pokemon["MGender"] = roundToPlace(event.target.value);
				//this.pokemon["FGender"] = roundToPlace(100 - event.target.value);
				this.gender.value = roundToPlace(event.target.value, 1);
				this.genderMLabel.textContent = String(roundToPlace(event.target.value, 1)) + '%';
				this.genderFLabel.textContent =
					String(roundToPlace(100 - event.target.value, 1)) + '%';
			}.bind(this)
		);

		Array.from(this.typeChecks).forEach(
			function (currentCheck) {
				currentCheck.addEventListener('change', function () {
					// Get the amount of currently checked types
					var checkedAmount = 0;
					Array.from(overview.typeChecks).forEach(function (check) {
						if (check.checked) {
							checkedAmount += 1;
						}
					});

					if (this.checked) {
						overview.typeLabels[checkedAmount - 1].classList.remove('hidden');
						overview.typeLabels[checkedAmount - 1].id = this.id;
						overview.typeLabels[checkedAmount - 1].innerText = this.id;
					} else {
						if (overview.typeLabels[0].id == this.id) {
							if (overview.typeLabels[1].id != '') {
								overview.typeLabels[0].id = overview.typeLabels[1].id;
								overview.typeLabels[0].innerText = overview.typeLabels[1].innerText;

								overview.typeLabels[1].id = '';
								overview.typeLabels[1].innerText = '';
								overview.typeLabels[1].classList.add('hidden');
							} else {
								overview.typeLabels[0].id = '';
								overview.typeLabels[0].innerText = 'No types';
							}
						} else if (overview.typeLabels[1].id == this.id) {
							overview.typeLabels[1].id = '';
							overview.typeLabels[1].innerText = '';
							overview.typeLabels[1].classList.add('hidden');
						}
					}

					// Disable all checks not currently checked if amount is 2 or higher, enable if not
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

		this.gender.value = this.pokemon['MGender'];
		if (this.genderCheck.checked) {
			this.genderMLabel.textContent = String(this.pokemon['MGender']) + '%';
			this.genderFLabel.textContent = String(this.pokemon['FGender']) + '%';
		}

		// Show type 1's label by removing hidden from it if it exists
		if (this.pokemon['Type1'] != '') {
			this.typeLabels[0].classList.remove('hidden');
			this.typeLabels[0].id = this.pokemon['Type1'];
			this.typeLabels[0].innerText = this.pokemon['Type1'];
		} else {
			this.typeLabels[0].classList.add('hidden');
			this.typeLabels[0].id = '';
			this.typeLabels[0].innerText = '';
		}
		if (this.pokemon['Type2'] != '') {
			this.typeLabels[1].classList.remove('hidden');
			this.typeLabels[1].id = this.pokemon['Type2'];
			this.typeLabels[1].innerText = this.pokemon['Type2'];
		} else {
			this.typeLabels[1].classList.add('hidden');
			this.typeLabels[1].id = '';
			this.typeLabels[1].innerText = '';
		}

		//  Disable all checks except for the ones with types
		Array.from(overview.typeChecks).forEach(function (check) {
			if (check.id == overview.pokemon['Type1'] || check.id == overview.pokemon['Type2']) {
				check.checked = true;
			} else {
				check.checked = false;
			}
		});

		// Get the amount of currently checked types
		var checkedAmount = 0;

		Array.from(overview.typeChecks).forEach(function (check) {
			if (check.checked) {
				checkedAmount += 1;
			}
		});

		// Disable all checks not currently checked if amount is 2 or higher, enable if not
		if (checkedAmount > 1) {
			Array.from(overview.typeChecks).forEach(function (check) {
				if (!check.checked) {
					check.disabled = true;
				} else {
					check.disabled = false;
				}
			});
		} else {
			Array.from(overview.typeChecks).forEach(function (check) {
				check.disabled = false;
			});
		}

		this.height.value = this.pokemon['Height'];
		this.weight.value = this.pokemon['Weight'];
		this.number.value = String(this.pokemon['Number']).padStart(4, '0');
		this.ability.innerText = this.pokemon['Ability'];

		imageHandler.loadImageFromFile(
			cordova.file.dataDirectory + 'files/Dex/' + this.pokemon['IconPath'],
			false,
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
		var type1Changed = this.typeLabels[0].id != this.pokemon['Type1'];
		var type2Changed = this.typeLabels[0].id != this.pokemon['Type2'];
		// console.log(
		// 	this.genderCheck.checked,
		// 	type1Changed,
		// 	type2Changed,
		// 	genderBoolChanged,
		// 	abilityChanged,
		// 	genderChanged,
		// 	nameChanged,
		// 	numberChanged,
		// 	heightChanged,
		// 	weightChanged
		// );

		if (
			type1Changed ||
			type2Changed ||
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
		data['Type1'] = this.typeLabels[0].id;
		data['Type2'] = this.typeLabels[1].id;
		data['Height'] = this.height.value;
		data['Weight'] = this.weight.value;
		data['Ability'] = this.ability.innerText;
		data['hasGender'] = this.genderCheck.checked;
		if (this.genderCheck.checked) {
			data['MGender'] = roundToPlace(this.gender.value, 1);
			data['FGender'] = roundToPlace(100 - this.gender.value, 1);
		} else {
			data['MGender'] = this.pokemon['MGender'];
			data['FGender'] = this.pokemon['FGender'];
		}
		data['IconPath'] = 'Icons/' + data['Name'] + '.png';

		pokemonData['Pokemon'][this.id] = data;
		this.pokemon = data;

		this.updatePokemonData();
		grid.updatePokemonData(this.id, this.pokemon);
		pokemonData['Pokemon'][this.id] = this.pokemon;
		saveDex();
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

		clearInterval(this.saveInterval);

		this.checkForSave();

		this.overview.classList.remove(this.pokemon['Type1']);

		// this.pokemon = {};
		// this.id = -1;
		this.typeMenuCheck.checked = false;

		document.addEventListener('backbutton', function () {}, false);
	}
}

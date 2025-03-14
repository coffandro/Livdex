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

		// top parts
		this.pokemonNameEntry = document.getElementById('overview-name-entry');
		this.pokemonImage = document.getElementById('overview-image');
		this.typeChecks = document.getElementsByClassName('typeCheckbox');
		this.typeLabels = document.getElementsByClassName('overview-type-label');
		this.typeMenuCheck = document.getElementById('toggleTypeMenu');

		// about section
		this.height = document.getElementById('about-height');
		this.weight = document.getElementById('about-weight');
		this.number = document.getElementById('overview-number');
		this.gender = document.getElementById('about-gender-slider');
		this.genderMLabel = document.getElementById('about-male-label');
		this.genderFLabel = document.getElementById('about-female-label');
		this.genderCheck = document.getElementById('about-gender-check');
		this.genderContainer = document.getElementById('about-gender-container');
		this.ability = document.getElementById('about-ability');

		// Stat section
		this.statBars = [];
		this.hp = document.getElementsByClassName('stat-hp');
		this.statBars.push(this.hp);
		this.atk = document.getElementsByClassName('stat-atk');
		this.statBars.push(this.atk);
		this.def = document.getElementsByClassName('stat-def');
		this.statBars.push(this.def);
		this.spatk = document.getElementsByClassName('stat-sp-atk');
		this.statBars.push(this.spatk);
		this.spdef = document.getElementsByClassName('stat-sp-def');
		this.statBars.push(this.spdef);
		this.speed = document.getElementsByClassName('stat-speed');
		this.statBars.push(this.speed);

		// Evo section
		this.evoPreTitle = document.getElementById('evolutions-pre-title');
		this.evoPostTitle = document.getElementById('evolutions-post-title');

		this.evoPre2 = [];
		this.evoPre2[0] = document.getElementById('evolutions-pre-2');
		this.evoPre2[1] = this.evoPre2[0].children[0];
		this.evoPre2[2] = this.evoPre2[0].children[1];

		this.evoPre2[0].addEventListener(
			'click',
			function () {
				this.showEvoPopup(this.evoPre2, 'Pre2');
			}.bind(this)
		);

		this.evoPre1 = [];
		this.evoPre1[0] = document.getElementById('evolutions-pre-1');
		this.evoPre1[1] = this.evoPre1[0].children[0];
		this.evoPre1[2] = this.evoPre1[0].children[1];
		this.evoPre1[0].addEventListener(
			'click',
			function () {
				this.showEvoPopup(this.evoPre1, 'Pre1');
			}.bind(this)
		);

		this.evoPost1 = [];
		this.evoPost1[0] = document.getElementById('evolutions-post-1');
		this.evoPost1[1] = this.evoPost1[0].children[0];
		this.evoPost1[2] = this.evoPost1[0].children[1];
		this.evoPost1[0].addEventListener(
			'click',
			function () {
				this.showEvoPopup(this.evoPost1, 'Post1');
			}.bind(this)
		);

		this.evoPost2 = [];
		this.evoPost2[0] = document.getElementById('evolutions-post-2');
		this.evoPost2[1] = this.evoPost2[0].children[0];
		this.evoPost2[2] = this.evoPost2[0].children[1];

		this.evoPost2[0].addEventListener(
			'click',
			function () {
				this.showEvoPopup(this.evoPost2, 'Post2');
			}.bind(this)
		);

		// evo popup
		this.popup = [
			document.getElementById('overview-popup-bg'),
			document.getElementById('overview-popup'),
			document.getElementById('overview-popup-content'),
		];

		this.popupCancelButton = document.getElementById('overview-popup-cancel-button');
		this.popupNoneButton = document.getElementById('overview-popup-none-button');
		this.popupNoneButtonFunctionPointer = function () {};

		this.popupNoneButton.addEventListener(
			'click',
			function () {
				this.noneButtonClicked();
			}.bind(this)
		);

		this.popupCancelButton.addEventListener(
			'click',
			function () {
				this.hideEvoPopup();
			}.bind(this)
		);

		this.statBars.forEach(function (value) {
			value[1].addEventListener('input', function (event) {
				value[0].innerText = event.target.value;
			});
		});

		// Save interval function
		this.saveInterval = null;

		// Image click event
		this.pokemonImage.addEventListener('click', function () {
			cordova.wavemaker.filePicker.selectImage(
				false, // to select multiple images
				function (selectedFilePaths) {
					if (selectedFilePaths[0] == undefined) {
						return;
					}

					imageHandler.copyFile(
						selectedFilePaths[0],
						'Dex/Icons/' + overview.pokemon['UUID'] + '.png',
						function (status) {
							if (status != null) {
								return;
							}

							imageHandler.loadImageFromFile(
								cordova.file.dataDirectory +
									'files/Dex/Icons/' +
									overview.pokemon['UUID'] +
									'.png',
								true,
								function (source) {
									overview.pokemonImage.src = source;
								}
							);
						}
					);
				},
				errorCallback
			);
		});

		// Pad number
		this.number.addEventListener(
			'focusout',
			function () {
				this.number.value = String(this.number.value.padStart(4, '0'));
			}.bind(this)
		);

		// Gender checkbox
		this.genderCheck.addEventListener(
			'change',
			function () {
				this.switchGender(this.genderCheck.checked);
			}.bind(this)
		);

		this.typeMenuCheck.addEventListener(
			'change',
			function () {
				if (this.typeMenuCheck.checked) {
					backButtonFunctionPointer = function () {
						this.typeMenuCheck.checked = false;
					}.bind(this);
				} else {
					backButtonFunctionPointer = this.closePokemon.bind(this);
				}
			}.bind(this)
		);

		// Gender slider
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

		// Type checkboxes
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

		// Get the container with types
		this.evoContainer = document.getElementById('overview-evolution-container');

		this.pokemon = {};
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

		// Set stat section
		this.hp[0].innerText = this.pokemon['HP'];
		this.hp[1].value = this.pokemon['HP'];
		this.atk[0].innerText = this.pokemon['Atk'];
		this.atk[1].value = this.pokemon['Atk'];
		this.def[0].innerText = this.pokemon['Def'];
		this.def[1].value = this.pokemon['Def'];
		this.spatk[0].innerText = this.pokemon['SpAtk'];
		this.spatk[1].value = this.pokemon['SpAtk'];
		this.spdef[0].innerText = this.pokemon['SpDef'];
		this.spdef[1].value = this.pokemon['SpDef'];
		this.speed[0].innerText = this.pokemon['Speed'];
		this.speed[1].value = this.pokemon['Speed'];

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
		this.number.value = String(this.pokemon['Number'].padStart(4, '0'));
		this.ability.innerText = this.pokemon['Ability'];

		if (this.pokemon['Line']['Pre2'] != '') {
			var pre2data = null;
			pokemonData['Pokemon'].forEach(
				function (value) {
					if (value['UUID'] == this.pokemon['Line']['Pre2']) {
						pre2data = value;
					}
				}.bind(this)
			);

			if (pre2data != null) {
				this.evoPre2[0].classList = pre2data['Type1'];

				imageHandler.loadImageFromFile(
					cordova.file.dataDirectory + 'files/Dex/Icons/' + pre2data['UUID'] + '.png',
					false,
					function (source) {
						this.evoPre2[1].src = source;
					}.bind(this)
				);
				this.evoPre2[1].classList.remove('hidden');
				this.evoPre2[2].innerText = pre2data['Name'];
			}
		} else {
			this.evoPre2[1].classList.add('hidden');
			this.evoPre2[0].classList = '';
			this.evoPre2[2].innerText = '';
		}

		if (this.pokemon['Line']['Pre1'] != '') {
			var pre1data = null;
			pokemonData['Pokemon'].forEach(
				function (value) {
					if (value['UUID'] == this.pokemon['Line']['Pre1']) {
						pre1data = value;
					}
				}.bind(this)
			);

			if (pre1data != null) {
				this.evoPre1[1].classList.remove('hidden');
				this.evoPre1[0].classList = pre1data['Type1'];

				imageHandler.loadImageFromFile(
					cordova.file.dataDirectory + 'files/Dex/Icons/' + pre1data['UUID'] + '.png',
					false,
					function (source) {
						this.evoPre1[1].src = source;
					}.bind(this)
				);
				this.evoPre1[2].innerText = pre1data['Name'];
			}
		} else {
			this.evoPre1[1].classList.add('hidden');
			this.evoPre1[0].classList = '';
			this.evoPre1[2].innerText = '';
		}

		if (this.pokemon['Line']['Post1'] != '') {
			var post1data = null;
			pokemonData['Pokemon'].forEach(
				function (value) {
					if (value['UUID'] == this.pokemon['Line']['Post1']) {
						post1data = value;
					}
				}.bind(this)
			);

			if (post1data != null) {
				this.evoPost1[1].classList.remove('hidden');
				this.evoPost1[0].classList = post1data['Type1'];

				imageHandler.loadImageFromFile(
					cordova.file.dataDirectory + 'files/Dex/Icons/' + post1data['UUID'] + '.png',
					false,
					function (source) {
						this.evoPost1[1].src = source;
					}.bind(this)
				);
				this.evoPost1[2].innerText = post1data['Name'];
			}
		} else {
			this.evoPost1[1].classList.add('hidden');
			this.evoPost1[0].classList = '';
			this.evoPost1[2].innerText = '';
		}

		if (this.pokemon['Line']['Post2'] != '') {
			var post2data = null;
			pokemonData['Pokemon'].forEach(
				function (value) {
					if (value['UUID'] == this.pokemon['Line']['Post2']) {
						post2data = value;
					}
				}.bind(this)
			);

			if (post2data != null) {
				this.evoPost2[1].classList.remove('hidden');
				this.evoPost2[0].classList = post2data['Type1'];

				imageHandler.loadImageFromFile(
					cordova.file.dataDirectory + 'files/Dex/Icons/' + post2data['UUID'] + '.png',
					false,
					function (source) {
						this.evoPost2[1].src = source;
					}.bind(this)
				);
				this.evoPost2[2].innerText = post2data['Name'];
			}
		} else {
			this.evoPost2[1].classList.add('hidden');
			this.evoPost2[0].classList = '';
			this.evoPost2[2].innerText = '';
		}

		imageHandler.loadImageFromFile(
			cordova.file.dataDirectory + 'files/Dex/Icons/' + this.pokemon['UUID'] + '.png',
			false,
			function (source) {
				this.pokemonImage.src = source;
			}.bind(this)
		);
	}

	setEvoSlot(slot, slotId, pokemon) {
		if (pokemon != null) {
			this.pokemon['Line'][slotId] = pokemon['UUID'];
			this.hideEvoPopup();

			slot[1].classList.remove('hidden');
			slot[0].classList = pokemon['Type1'];

			imageHandler.loadImageFromFile(
				cordova.file.dataDirectory + 'files/Dex/Icons/' + pokemon['UUID'] + '.png',
				false,
				function (source) {
					slot[1].src = source;
				}.bind(this)
			);
			slot[2].innerText = pokemon['Name'];
			this.savePokemon();
		} else {
			this.pokemon['Line'][slotId] = '';
			this.hideEvoPopup();
			slot[0].classList = '';
			slot[1].classList.add('hidden');
			slot[1].src = '';
			slot[2].innerText = '';
		}
	}

	noneButtonClicked() {
		this.popupNoneButtonFunctionPointer();
	}

	showEvoPopup(evoSlot, evoSlotId) {
		this.popup[0].classList.remove('hidden');
		this.popup[1].classList.remove('hidden');
		pokemonData['Pokemon'].forEach(
			function (value, index) {
				console.log(value, index);
				var button = document.createElement('button');
				button.classList.add('overview-popup-button');
				button.classList.add(value['Type1']);
				button.addEventListener(
					'click',
					function () {
						this.setEvoSlot(evoSlot, evoSlotId, value);
					}.bind(this)
				);

				var image = document.createElement('img');
				image.classList.add('overview-popup-image');

				imageHandler.loadImageFromFile(
					cordova.file.dataDirectory + 'files/Dex/Icons/' + value['UUID'] + '.png',
					false,
					function (source, image) {
						image.src = source;
					}.bind(this),
					image
				);

				var label = document.createElement('span');
				label.innerText = value['Name'];
				label.classList.add('overview-popup-label');

				button.appendChild(label);
				button.appendChild(image);
				this.popup[2].appendChild(button);
			}.bind(this)
		);

		this.popupNoneButtonFunctionPointer = function () {
			this.setEvoSlot(evoSlot, evoSlotId, null);
		}.bind(this);

		backButtonFunctionPointer = this.hideEvoPopup.bind(this);
	}

	hideEvoPopup() {
		this.popup[0].classList.add('hidden');
		this.popup[1].classList.add('hidden');
		this.popup[2].innerHTML = '';

		backButtonFunctionPointer = this.closePokemon.bind(this);
	}

	checkForSave() {
		var genderBoolChanged = this.genderCheck.checked != this.pokemon['hasGender'];
		if (this.genderCheck.checked) {
			var genderChanged = this.gender.value != this.pokemon['MGender'];
		} else {
			var genderChanged = false;
		}
		// var imageChanged = this.pokemonImage.src != imageHandler.images[this.pokemon['UUID']];
		var nameChanged = this.pokemonNameEntry.value != this.pokemon['Name'];
		var numberChanged = this.number.value != this.pokemon['Number'];
		var abilityChanged = this.ability.innerText != this.pokemon['Ability'];
		var heightChanged = this.height.value != this.pokemon['Height'];
		var weightChanged = this.weight.value != this.pokemon['Weight'];
		var type1Changed = this.typeLabels[0].id != this.pokemon['Type1'];
		var type2Changed = this.typeLabels[0].id != this.pokemon['Type2'];
		var hpChanged = this.hp[1].value != this.pokemon['HP'];
		var atkChanged = this.atk[1].value != this.pokemon['Atk'];
		var defChanged = this.def[1].value != this.pokemon['Def'];
		var spatkChanged = this.spatk[1].value != this.pokemon['SpAtk'];
		var spdefChanged = this.spdef[1].value != this.pokemon['SpDef'];
		var speedChanged = this.speed[1].value != this.pokemon['Speed'];
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
		// 	weightChanged,
		// 	hpChanged,
		// 	atkChanged,
		// 	defChanged,
		// 	spatkChanged,
		// 	spdefChanged,
		// 	speedChanged
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
			weightChanged ||
			hpChanged ||
			atkChanged ||
			defChanged ||
			spatkChanged ||
			spdefChanged ||
			speedChanged
		) {
			this.savePokemon();
		}
	}

	savePokemon() {
		// Find this.pokemon in main pokemon dict, overwrite, save and update

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
		// data['IconPath'] = this.pokemon['IconPath'];

		// Update stats
		this.pokemon['HP'] = this.hp[1].value;
		this.pokemon['Atk'] = this.atk[1].value;
		this.pokemon['Def'] = this.def[1].value;
		this.pokemon['SpAtk'] = this.spatk[1].value;
		this.pokemon['SpDef'] = this.spdef[1].value;
		this.pokemon['Speed'] = this.speed[1].value;

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

		backButtonFunctionPointer = this.closePokemon.bind(this);
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

		backButtonFunctionPointer = function () {};
	}
}

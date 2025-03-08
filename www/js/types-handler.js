const supEff = {
	Normal: [],
	Fire: ['Bug', 'Grass', 'Ice', 'Steel'],
	Fighting: ['Normal', 'Rock', 'Ice', 'Steel', 'Dark'],
	Water: ['Ground', 'Rock', 'Fire'],
	Flying: ['Fighting', 'Bug', 'Grass'],
	Grass: ['Ground', 'Rock', 'Water'],
	Poison: ['Grass', 'Fairy'],
	Electric: ['Flying', 'Water'],
	Ground: ['Poison', 'Rock', 'Fire', 'Electric', 'Steel'],
	Psychic: ['Fighting', 'Poison'],
	Rock: ['Flying', 'Bug', 'Fire', 'Ice'],
	Ice: ['Flying', 'Ground', 'Grass', 'Dragon'],
	Bug: ['Grass', 'Psychic', 'Dark'],
	Dragon: ['Dragon'],
	Ghost: ['Ghost', 'Psychic'],
	Dark: ['Ghost', 'Psychic'],
	Steel: ['Rock', 'Ice', 'Fairy'],
	Fairy: ['Fighting', 'Dragon', 'Dark'],
};

const notEff = {
	Normal: ['Rock', 'Steel'],
	Fire: ['Rock', 'Fire', 'Water', 'Dragon'],
	Fighting: ['Flying', 'Poison', 'Bug', 'Psychic', 'Fairy'],
	Water: ['Water', 'Grass', 'Dragon'],
	Flying: ['Rock', 'Electric', 'Steel'],
	Grass: ['Flying', 'Poison', 'Bug', 'Fire', 'Grass', 'Dragon', 'Steel'],
	Poison: ['Posion', 'Ground', 'Rock', 'Ghost'],
	Electric: ['Grass', 'Electric', 'Dragon'],
	Ground: ['Bug', 'Grass'],
	Psychic: ['Psychic', 'Steel'],
	Rock: ['Fighting', 'Ground', 'Steel'],
	Ice: ['Water', 'Ice', 'Steel', 'Fire'],
	Bug: ['Fighting', 'Flying', 'Poison', 'Ghost', 'Steel', 'Fire', 'Fairy'],
	Dragon: ['Steel'],
	Ghost: ['Dark'],
	Dark: ['Fighting', 'Dark', 'Fairy'],
	Steel: ['Steel', 'Fire', 'Water', 'Electric'],
	Fairy: ['Poison', 'Steel', 'Fire'],
};

const noEff = {
	Normal: ['Ghost'],
	Fire: [],
	Fighting: ['Ghost'],
	Water: [],
	Flying: [],
	Grass: [],
	Poison: ['Steel'],
	Electric: ['Ground'],
	Ground: ['Flying'],
	Psychic: ['Dark'],
	Rock: [],
	Ice: [],
	Bug: [],
	Dragon: ['Fairy'],
	Ghost: ['Normal'],
	Dark: [],
	Steel: [],
	Fairy: [],
};

const weak = {
	Normal: ['Fighting'],
	Fire: ['Ground', 'Rock', 'Water'],
	Fighting: ['Flying', 'Psychic', 'Fairy'],
	Water: ['Grass', 'Electric'],
	Flying: ['Rock', 'Electric', 'Ice'],
	Grass: ['Flying', 'Poison', 'Bug', 'Fire', 'Ice'],
	Poison: ['Ground', 'Psychic'],
	Electric: ['Ground'],
	Ground: ['Water', 'Grass', 'Ice'],
	Psychic: ['Bug', 'Ghost', 'Dark'],
	Rock: ['Fighting', 'Ground', 'Water', 'Grass', 'Steel'],
	Ice: ['Fighting', 'Rock', 'Fire', 'Steel'],
	Bug: ['Flying', 'Rock', 'Fire'],
	Dragon: ['Ice', 'Dragon', 'Fairy'],
	Ghost: ['Ghost', 'Dark'],
	Dark: ['Fighting', 'Bug', 'Fairy'],
	Steel: ['Fighting', 'Ground', 'Fire'],
	Fairy: ['Poison', 'Steel'],
};

const resist = {
	Normal: [],
	Fire: ['Bug', 'Fire', 'Grass', 'Steel', 'Ice', 'Fairy'],
	Fighting: ['Rock', 'Bug', 'Dark'],
	Water: ['Fire', 'Water', 'Ice', 'Steel'],
	Flying: ['Fighting', 'Bug', 'Grass'],
	Grass: ['Ground', 'Water', 'Grass', 'Electric'],
	Poison: ['Fighting', 'Poison', 'Grass', 'Bug', 'Fairy'],
	Electric: ['Flying', 'Electric', 'Steel'],
	Ground: ['Poison', 'Rock'],
	Psychic: ['Fighting', 'Psychic'],
	Rock: ['Normal', 'Flying', 'Poison', 'Fire'],
	Ice: ['Ice'],
	Bug: ['Fighting', 'Ground', 'Grass'],
	Dragon: ['Fire', 'Water', 'Grass', 'Electric'],
	Ghost: ['Poison', 'Bug'],
	Dark: ['Ghost', 'Dark'],
	Steel: [
		'Normal',
		'Flying',
		'Rock',
		'Bug',
		'Steel',
		'Grass',
		'Psychic',
		'Ice',
		'Dragon',
		'Fairy',
	],
	Fairy: ['Fighting', 'Bug', 'Dark'],
};

const immune = {
	Normal: ['Ghost'],
	Fire: [],
	Fighting: [],
	Water: [],
	Flying: ['Ground'],
	Grass: [],
	Poison: [],
	Electric: [],
	Ground: ['Electric'],
	Psychic: [],
	Rock: [],
	Ice: [],
	Bug: [],
	Dragon: [],
	Ghost: ['Normal', 'Fighting'],
	Dark: ['Psychic'],
	Steel: ['Poison'],
	Fairy: ['Dragon'],
};

function getWeak(type1, type2 = null) {
	if (type2 == null) {
		return weak[type1];
	} else {
		var returnArr = [];

		weak[type1].forEach((iType1) => {
			weak[type2].forEach((iType2) => {
				if (iType1 == iType2) {
					returnArr.push('2x' + iType1);
				}
			});
		});

		return returnArr;
	}
}

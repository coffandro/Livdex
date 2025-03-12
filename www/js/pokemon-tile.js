// Create a class for the element
class PokemonTile extends HTMLElement {
	constructor(pokemon, id) {
		// Always call super first in constructor, due to JS being shit and not just doing it by itself
		super();
		this.editing = false;
		this.pokemon = pokemon;
		this.id = id;
		this.name = null;
		this.type1 = null;
		this.typ2 = null;
		this.image = null;
		this.button = null;
		this.style = null;
		this.prevButton = null;
		this.nextButton = null;
		this.upButton = null;
		this.downButton = null;
		this.deleteButton = null;
	}

	connectedCallback() {
		// Exit if shadow root already exists
		if (!!this.shadowRoot) {
			return;
		}

		// Create a shadow root
		const shadow = this.attachShadow({ mode: 'open' });

		this.name = document.createElement('span');
		this.name.classList.add('pokemon-name');
		this.name.innerText = this.pokemon['Name'];

		this.type1 = document.createElement('span');
		this.type1.classList.add('pokemon-type-1');
		if (this.pokemon['Type1'] == '') {
			this.type1.classList.add('hidden');
		} else {
			this.type1.innerText = this.pokemon['Type1'];
		}

		this.type2 = document.createElement('span');
		this.type2.classList.add('pokemon-type-2');
		if (this.pokemon['Type2'] == '') {
			this.type2.classList.add('hidden');
		} else {
			this.type2.innerText = this.pokemon['Type2'];
		}

		this.image = document.createElement('img');
		this.image.classList.add('pokemon-image');

		imageHandler.loadImageFromFile(
			cordova.file.dataDirectory + 'files/Dex/Icons/' + this.pokemon['UUID'] + '.png',
			false,
			function (source, image) {
				image.src = source;
			},
			this.image
		);

		this.button = document.createElement('div');
		this.button.classList = 'pokemon-button';
		this.button.addEventListener('click', this.mainClickAction.bind(this));

		if (this.pokemon['Type1'] != '') {
			this.button.classList.add(this.pokemon['Type1']);
		} else {
			this.button.classList.add('Normal');
		}

		this.prevButton = document.createElement('button');
		this.prevButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
		this.prevButton.classList.add('pokemon-prev');
		this.prevButton.classList.add('hidden');
		this.prevButton.addEventListener('click', this.prevClickAction.bind(this), false);

		this.nextButton = document.createElement('button');
		this.nextButton.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
		this.nextButton.classList.add('pokemon-next');
		this.nextButton.classList.add('hidden');
		this.nextButton.addEventListener('click', this.nextClickAction.bind(this), false);

		this.upButton = document.createElement('button');
		this.upButton.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
		this.upButton.classList.add('pokemon-up');
		this.upButton.classList.add('hidden');
		this.upButton.addEventListener('click', this.upClickAction.bind(this), false);

		this.downButton = document.createElement('button');
		this.downButton.innerHTML = '<i class="fa-solid fa-arrow-down"></i>';
		this.downButton.classList.add('pokemon-down');
		this.downButton.classList.add('hidden');
		this.downButton.addEventListener('click', this.downClickAction.bind(this), false);

		this.deleteButton = document.createElement('button');
		this.deleteButton.innerHTML = '<i class="fa-solid fa-x"></i>';
		this.deleteButton.classList.add('pokemon-delete');
		this.deleteButton.classList.add('hidden');
		this.deleteButton.addEventListener('click', this.deleteClickAction.bind(this), false);

		// Attach the created elements to the shadow dom
		var link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('href', 'css/pokemon-button.css');
		shadow.appendChild(link);
		shadow.appendChild(this.button);

		this.button.appendChild(this.prevButton);
		this.button.appendChild(this.nextButton);
		this.button.appendChild(this.upButton);
		this.button.appendChild(this.downButton);
		this.button.appendChild(this.deleteButton);
		this.button.appendChild(this.name);
		this.button.appendChild(this.type1);
		this.button.appendChild(this.type2);
		this.button.appendChild(this.image);
	}

	enableEdit() {
		this.button.classList.add('edit-mode');
		this.editing = true;
		this.prevButton.classList.remove('hidden');
		this.nextButton.classList.remove('hidden');
		this.upButton.classList.remove('hidden');
		this.downButton.classList.remove('hidden');
		this.deleteButton.classList.remove('hidden');
	}

	disableEdit() {
		this.button.classList.remove('edit-mode');
		this.editing = false;
		this.prevButton.classList.add('hidden');
		this.nextButton.classList.add('hidden');
		this.upButton.classList.add('hidden');
		this.downButton.classList.add('hidden');
		this.deleteButton.classList.add('hidden');
	}

	setData(pokemon, id) {
		this.pokemon = pokemon;
		this.id = id;
		this.name.innerText = this.pokemon['Name'];

		if (this.pokemon['Type1'] == '') {
			this.type1.classList.add('hidden');
		} else {
			this.type1.classList.remove('hidden');
			this.type1.innerText = this.pokemon['Type1'];
		}

		if (this.pokemon['Type2'] == '') {
			this.type2.classList.add('hidden');
		} else {
			this.type2.classList.remove('hidden');
			this.type2.innerText = this.pokemon['Type2'];
		}

		imageHandler.loadImageFromFile(
			cordova.file.dataDirectory + 'files/Dex/Icons/' + this.pokemon['UUID'] + '.png',
			false,
			function (source, image) {
				image.src = source;
			},
			this.image
		);

		this.button.classList = 'pokemon-button';

		if (this.pokemon['Type1'] != '') {
			this.button.classList.add(this.pokemon['Type1']);
		} else {
			this.button.classList.add('Normal');
		}
	}

	downClickAction() {
		if (this.editing) {
			grid.movePokemon(this.id, 2);
		}
	}

	upClickAction() {
		if (this.editing) {
			grid.movePokemon(this.id, -2);
		}
	}

	prevClickAction() {
		if (this.editing) {
			grid.movePokemon(this.id, -1);
		}
	}

	nextClickAction() {
		if (this.editing) {
			grid.movePokemon(this.id, 1);
		}
	}

	deleteClickAction() {
		if (this.editing) {
			grid.promptPokemonDeletion(this.id);
		}
	}

	mainClickAction() {
		if (!this.editing) {
			overview.openPokemon(this.pokemon, this.id);
		}
	}
}

customElements.define('pokemon-tile', PokemonTile);

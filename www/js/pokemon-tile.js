// Create a class for the element
class PokemonTile extends HTMLElement {
	constructor(pokemon, id) {
		// Always call super first in constructor, due to JS being shit and not just doing it by itself
		super();
		this.pokemon = pokemon;
		this.id = id;
		this.name = null;
		this.type1 = null;
		this.typ2 = null;
		this.image = null;
		this.button = null;
		this.style = null;
	}

	connectedCallback() {
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

		loadImageFromFile(
			cordova.file.dataDirectory + 'files/Dex/' + this.pokemon['IconPath'],
			function (source, image) {
				image.src = source;
			},
			this.image
		);

		this.button = document.createElement('div');
		this.button.classList.add('pokemon-button');

		if (this.pokemon['Type1'] != '') {
			this.button.classList.add(this.pokemon['Type1']);
		} else {
			this.button.classList.add('Normal');
		}

		this.button.addEventListener(
			'click',
			function () {
				overview.openPokemon(this.pokemon, this.id);
			}.bind(this)
		);

		this.styleNode = document.createElement('style');

		this.styleNode.textContent = `
		.hidden {
			display: none !important;
		}

		.Normal { background: #A8A878 !important; --bg-color: #A8A878 !important;}
		.Fighting { background: #C03028 !important; --bg-color: #C03028 !important;}
		.Flying { background: #A890F0 !important; --bg-color: #A890F0 !important;}
		.Poison { background: #A040A0 !important; --bg-color: #A040A0 !important;}
		.Ground { background: #E0C068 !important; --bg-color: #E0C068 !important;}
		.Rock { background: #B8A038 !important; --bg-color: #B8A038 !important;}
		.Bug { background: #A8B820 !important; --bg-color: #A8B820 !important;}
		.Ghost { background: #705898 !important; --bg-color: #705898 !important;}
		.Steel { background: #B8B8D0 !important; --bg-color: #B8B8D0 !important;}
		.Fire { background: #FA6C6C !important; --bg-color: #FA6C6C !important;}
		.Water { background: #6890F0 !important; --bg-color: #6890F0 !important;}
		.Grass { background: #48CFB2 !important; --bg-color: #48CFB2 !important;}
		.Electric { background: #FFCE4B !important; --bg-color: #FFCE4B !important;}
		.Psychic { background: #F85888 !important; --bg-color: #F85888 !important;}
		.Ice { background: #98D8D8 !important; --bg-color: #98D8D8 !important;}
		.Dragon { background: #7038F8 !important; --bg-color: #7038F8 !important;}
		.Dark { background: #705848 !important; --bg-color: #705848 !important;}
		.Fairy { background: #EE99AC !important; --bg-color: #EE99AC !important;}

		.pokemon-button {
			--bg-color: black;
			background-color: black;
			color: white;
			border-radius: 1em;
			height: 100px;
			width: 45vw;
			position: relative;
			transition: transform box-shadow .01s ease-out;
			will-change: transform;
			box-shadow: 0 .25rem 0 hsl(from var(--bg-color) h s l / 0.5);
			user-select: none;
			font-family: "Jack Armstrong";
		}

		.pokemon-button:active {
			transform: translate(0 ,.25rem);
			box-shadow: 0 0 0 hsl(from var(--bg-color) h s l / 0.5);
		}

		.edit-mode .pokemon-button {
			animation: shake 0.5s;

			/* When the animation is finished, start again */
			animation-iteration-count: infinite; 
		}

		.pokemon-name {
			font-weight: bold;
			position: absolute;
			top: 10px;
			left: 10px;
		}
		.pokemon-type-1 {
			position: absolute;
			font-size: 10px;
			bottom: 10px;
			left: 12px;
			background-color: rgba(255, 255, 255, 0.5);
			padding: 3px;
			border-radius: 10px;
		}

		.pokemon-type-2 {
			display: block;
			font-size: 10px;
			position: absolute;
			bottom: 30px;
			left: 12px;
			background-color: rgba(255, 255, 255, 0.5);
			padding: 3px;
			border-radius: 10px;
		}

		.pokemon-regional {
			display: block;
			position: absolute;
			left: 10px;
			bottom: 5px;

			font-size: 10px;
		}

		.pokemon-image {
			width: 75px;
			height: 75px;
			position: absolute;
			right: 0;
			bottom: 0;
		}
		`;

		// Attach the created elements to the shadow dom
		shadow.appendChild(this.styleNode);

		shadow.appendChild(this.button);
		this.button.appendChild(this.name);
		this.button.appendChild(this.type1);
		this.button.appendChild(this.type2);
		this.button.appendChild(this.image);
	}

	setData(pokemon, id) {
		this.pokemon = pokemon;
		this.id = id;
		this.name.innerText = this.pokemon['Name'];

		if (this.pokemon['Type1'] == '') {
			this.type1.classList.add('hidden');
		} else {
			this.type1.innerText = this.pokemon['Type1'];
		}

		if (this.pokemon['Type2'] == '') {
			this.type2.classList.add('hidden');
		} else {
			this.type2.innerText = this.pokemon['Type2'];
		}

		loadImageFromFile(
			cordova.file.dataDirectory + 'files/Dex/' + this.pokemon['IconPath'],
			function (source, image) {
				image.src = source;
			},
			this.image
		);

		if (this.pokemon['Type1'] != '') {
			this.button.classList.add(this.pokemon['Type1']);
		} else {
			this.button.classList.add('Normal');
		}

		this.button.removeEventListener(
			'click',
			function () {
				overview.openPokemon(this.pokemon, this.id);
			}.bind(this)
		);

		this.button.addEventListener(
			'click',
			function () {
				overview.openPokemon(this.pokemon, this.id);
			}.bind(this)
		);
	}
}

customElements.define('pokemon-tile', PokemonTile);

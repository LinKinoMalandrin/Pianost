class Octave {
	constructor(n) {
		this.n = n;
		this.DOM = createElement('div', 'octave');
		this.keys = []

		let white = createElement('div', 'white');
		let black = createElement('div', 'black');

		let container = createElement('div', '');

		for (let keyString of KEYS) {
			this.keys.push(new Key(keyString, n));
		}


		container.appendChild(this.keys[1].DOM);
		container.appendChild(this.keys[3].DOM);

		black.appendChild(container);

		container = createElement('div', '');

		container.appendChild(this.keys[6].DOM);
		container.appendChild(this.keys[8].DOM);
		container.appendChild(this.keys[10].DOM);

		black.appendChild(container);

		this.DOM.appendChild(black);

		white.appendChild(this.keys[0].DOM);
		white.appendChild(this.keys[2].DOM);
		white.appendChild(this.keys[4].DOM);
		white.appendChild(this.keys[5].DOM);
		white.appendChild(this.keys[7].DOM);
		white.appendChild(this.keys[9].DOM);
		white.appendChild(this.keys[11].DOM);

		this.DOM.appendChild(white);
	}
	selectKey(key, attribute) {
		this.keys[key.getKey()].select(attribute);
	}

	clear() {
		for (let key of this.keys)
			key.clear();
	}
}
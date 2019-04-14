class Key {

	constructor(value, octave) {
		if (value == undefined) this.value = 0;
		else if (isNaN(value)) this.value = KEYS.indexOf(value);
		else this.value = value;

		if (octave != undefined) this.value += octave * 12;

		this.DOM = createElement('div', 'key');
		this.DOM.classList.add(this.toString());
		this.DOM.classList.add(this.keyString());
		this.DOM.innerHTML = this.toString();
		let str = this.toString();
		addMouseUpDown(this.DOM, this);
	}

	setOctave(octave) { this.value = (this.value % 12) + 12 * octave; return this; }
	upperOctave() { this.value += 12; return this; }
	lessOctave() { this.value -= 12; return this; }
	getOctave() { return Math.trunc(this.value / 12); }
	getKey() { return this.value % 12; }

	addSemiTons(n) {
		this.value += n;
		return this;
	}
	minusSemiTons(n) {
		this.value -= n;
		return this;
	}
	toString() {
		return KEYS[this.value % 12]+""+Math.trunc(this.value / 12);
	}
	keyString() {
		return KEYS[this.value % 12];
	}
	select(attribute) {
		this.DOM.classList.add('selected');
		this.DOM.setAttribute('selection', attribute);
	}
	selected() {
		return this.DOM.classList.contains('selected');
	}
	play() {
		SYNTH.triggerAttack([this.toString()], undefined, 1);
	}
	stop() {
		SYNTH.triggerRelease([this.toString()]);
	}
	clear() {
		this.DOM.classList.remove('selected');
		this.DOM.setAttribute('selection', '');
	}
	addClick(callback, piano) {
		let thisbis = this;
		this.DOM.addEventListener('click', function (e) {
			callback(e, thisbis, piano);
		});
	}
}
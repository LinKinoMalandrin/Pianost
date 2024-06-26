class Piano {
	constructor(container, from, to) {
		this.DOM = (container == undefined) ? document.body : container;
		this.from = (from == undefined) ? 1 : from;
		this.to = (to == undefined) ? 10 : to;
		this.DOM.innerHTML = "";
		this.octaves = [];
		for (let i = this.from; i <= this.to; i++) {
			let oct = new Octave(i);
			this.octaves.push(oct);
			this.DOM.appendChild(oct.DOM);
		}
	}

	addClickOnKeys(callback) {
		for (let oct of this.octaves)
			oct.addClickOnKeys(callback, this);
	}

	selectChord(chord) {
		for (let key of chord.getKeys()) {
			let oct = key.getOctave();
			if (oct > this.to || oct < this.from)
				continue;
			this.octaves[oct- this.from].selectKey(key, 'chord');
		}
	}

	selectScale(scale) {
		for (let key of scale.getKeys()) {
			for (let octave of this.octaves) {
				octave.selectKey(key, 'scale');
			}
		}
		return this;
	}

	clear() {
		for (let octave of this.octaves)
			octave.clear();
		return this;
	}
}

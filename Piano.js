let KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let SYNTH = new Tone.PolySynth(7, Tone.Synth).toMaster();

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
}

class Scale {

	constructor(key, tonality) {
		if (key == undefined) this.key = new Key('C', 4);
		else this.key = key;

		if (tonality == undefined) this.tonality = 'Major';
		else this.tonality = tonality;
		this.array = Scale.getArray(key, tonality);
	}

	static getArray(key, tonality) {
		let keys = [];
		switch (tonality) {
			case 'Major' :
				keys.push([key, 'first']);
				keys.push([new Key(key.value + 2), 'second']);
				keys.push([new Key(key.value + 4), 'third-M']);
				keys.push([new Key(key.value + 5), 'fourth']);
				keys.push([new Key(key.value + 7), 'fifth']);
				keys.push([new Key(key.value + 9), 'sixth']);
				keys.push([new Key(key.value + 11), 'seventh']);
				break;
			case 'Minor' :
				keys.push([key, 'first']);
				keys.push([new Key(key.value + 2), 'second']);
				keys.push([new Key(key.value + 3), 'third-m']);
				keys.push([new Key(key.value + 5), 'fourth']);
				keys.push([new Key(key.value + 7), 'fifth']);
				keys.push([new Key(key.value + 8), 'sixth-m']);
				keys.push([new Key(key.value + 10), 'seventh-m']);
				break;
		}
		return keys;
	}
	getKeys() {
		return this.array.map(x => x[0]);
	}
}

class Chord {
	constructor(key, more, reversed) {
		this.reversed = (reversed == undefined) ? false : reversed;
		this.more = (more == undefined) ? '' : more;
		this.key = (key == undefined) ? new Key() : key;
		this.array = Chord.getArray(this.key, this.more)
	}

	static getArray(key, more) {
		let array = [[key, 'first']];
		switch (more) {
			case '' :
				array.push([new Key(key.value + 4), 'third-M']);
				array.push([new Key(key.value + 7), 'fifth']);
				break;
			case 'm' :
				array.push([new Key(key.value + 3), 'third-m']);
				array.push([new Key(key.value + 7), 'fifth']);
				break;
			case 'dim' :
				array.push([new Key(key.value + 3), 'third-m']);
				array.push([new Key(key.value + 6), 'fifth-b']);
				break;
		}
		return array;
	}
	toString() {
		return this.key.keyString() + "" + this.more + " beginning at "+this.key.toString();
	}

	getKeys() {
		return this.array.map(x => x[0]);
	}
	getKeysWithColor() {
		return this.array;
	}
	play() {
		for (let key of this.array)
			key[0].play();
	}
	stop() {
		for (let key of this.array)
			key[0].stop();
	}
}

class Piano {
	constructor(container, from, to) {
		this.DOM = (container == undefined) ? document.body : container;
		this.from = (from == undefined) ? 1 : from;
		this.to = (to == undefined) ? 10 : to;

		this.octaves = [];
		for (let i = this.from; i <= this.to; i++) {
			let oct = new Octave(i);
			this.octaves.push(oct);
			this.DOM.appendChild(oct.DOM);
		}
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
	}

	clear() {
		for (let octave of this.octaves)
			octave.clear();
	}
}

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

function launchTest() {
	let piano = new Piano(document.getElementById('PIANOTEST'), 3, 5);

	let cmajor = new Scale(new Key('C#'), 'Major');
	let am4 = new Chord(new Key("A", 4), 'm');

	addMouseUpDown(document.getElementById('PLAYCHORD'), am4);
	document.getElementById('CLEARPIANO').addEventListener('click', function(e) {
		piano.clear();
	});
	document.getElementById('SHOWSCALE').addEventListener('click', function(e) {
		piano.selectScale(cmajor);
	});
	document.getElementById('SHOWCHORD').addEventListener('click', function(e) {
		piano.selectChord(am4);
	});
}

function createElement(type, classlist="") {
	let e = document.createElement(type);
	if (Array.isArray(classlist)) e.classList = classlist;
	else e.className = classlist;
	return e;
}

function addMouseUpDown(element, playable) {
	element.addEventListener('mousedown', function (e) {
		playable.play();
	});
	element.addEventListener('mouseup', function (e) {
		playable.stop();
	});
}

launchTest();
let KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function Key(value, octave) {

	if (value == undefined) this.value = 0;
	else if (isNaN(value)) this.value = KEYS.indexOf(value);
	else this.value = value;

	if (octave != undefined) this.value += octave * 12;

	this.setOctave = function (octave) { this.value = (this.value % 12) + 12 * octave; return this; }
	this.upperOctave = function () { this.value += 12; return this; }
	this.lessOctave = function () { this.value -= 12; return this; }

	this.addSemiTons = function (n) {
		this.value += n;
		return this;
	}
	this.minusSemiTons = function (n) {
		this.value -= n;
		return this;
	}
	this.toString = function () {
		return KEYS[this.value % 12]+""+Math.trunc(this.value / 12);
	}
	this.keyString = function() {
		return KEYS[this.value % 12];
	}
}

function Scale(key, tonality) {

	if (key == undefined) this.key = new Key('C', 4);
	else this.key = key;
	if (tonality == undefined) this.tonality = 'Major';
	else this.tonality = tonality;

	this.getKeys = function () {
		let keys = [];
		switch (this.tonality) {
			case 'Major' :
				keys.push([this.key, 'first']);
				keys.push([new Key(this.key.value + 2), 'second']);
				keys.push([new Key(this.key.value + 4), 'third-M']);
				keys.push([new Key(this.key.value + 5), 'fourth']);
				keys.push([new Key(this.key.value + 7), 'fifth']);
				keys.push([new Key(this.key.value + 9), 'sixth']);
				keys.push([new Key(this.key.value + 11), 'seventh']);
				break;
			case 'Minor' :
				keys.push([this.key, 'first']);
				keys.push([new Key(this.key.value + 2), 'second']);
				keys.push([new Key(this.key.value + 3), 'third-m']);
				keys.push([new Key(this.key.value + 5), 'fourth']);
				keys.push([new Key(this.key.value + 7), 'fifth']);
				keys.push([new Key(this.key.value + 8), 'sixth-m']);
				keys.push([new Key(this.key.value + 10), 'seventh-m']);
				break;
		}
	}
}

function Chord(array) {
	this.array = array;
}

function Piano(from, to) {
	if (from == undefined || to == undefined) return undefined;
	this.from = from;
	this.to = to;
	this.octaves = [];
	for (let i = from; i <= to; i++) {
		let piano = [];
		for (let j = 0; j < 12; j++) {
			piano.push(new Key(j + i * 12));
		}
	}
}
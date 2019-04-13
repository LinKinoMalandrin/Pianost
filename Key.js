let KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function Key(value, octave) {

	if (value == undefined) this.value = 0;
	else this.value = KEYS.indexOf(value);

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
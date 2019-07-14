const Keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

class Key {

	constructor(value, octave) {
		if (typeof value === 'string') {
			this.value = Keys.indexOf(value.toUpperCase());
			this.octave = octave || 0;
		} else {
			this.value = value ? value % 12 : 0;
			this.octave = octave || value ? Math.trunc(value / 12) : 0;
		}
	}

	get string() { return Keys[this.value] + this.octave; }
	get note() { return Keys[this.value]; }

}

const Intervals = [
	{ name:'Octave', tag:'stable' },
	{ name:'Second minor', tag:'tension' },
	{ name:'Second major', tag:'tenson' },
	{ name:'Third minor', tag:'color' },
	{ name:'Third major', tag:'color' },
	{ name:'Fourth', tag:'stable' },
	{ name:'Fourth aug', tag:'tension' },
	{ name:'Fifth', tag:'stable' },
	{ name:'Sixth minor', tag:'color' },
	{ name:'Sixth major', tag:'color' },
	{ name:'Seventh minor', tag:'tension' },
	{ name:'Seventh major', tag:'tension' }
];

class Interval {

	constructor(first, second) {
		this.first = first;
		this.second = second;
	}

	get value() { return Math.abs(this.first.value - this.second.value) % 12; }
	get tag() { return Intervals[this.value].tag; }
	get name() { return Intervals[this.value].name; }

}

class Chord {

}

let k = new Key();
console.log(Chords['11']);
const Keys = {
	all: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
	blacks: ['C#', 'D#', 'F#', 'G#', 'A#'],
	whites: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
}

class Key {

	constructor(value, octave) {
		if (typeof value === 'string') {
			this.value = Keys.all.indexOf(value.toUpperCase());
			if (octave === undefined)
				this.octave = 0;
			else
				this.octave = octave;
		} else {
			this.value = value ? value % 12 : 0;
			if (octave === undefined) {
				this.octave = (value !== undefined) ? Math.trunc(value / 12) : 0;
			}
			else {
				this.octave = (octave  === undefined) ? ((value) ? Math.trunc(value / 12) : 0) : octave;
			}
		}
	}

	valueOf() {
		return this.value + this.octave * 12;
	}

	get string() { return Keys.all[this.value] + this.octave; }
	get note() { return Keys.all[this.value]; }
	get white() { return this.note.length === 1; }
	get black() { return this.note.length === 2; }
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

const Scale = {
	Minor : key => new __Scale(key, [2, 3, 5, 7, 8, 10]),
	Major : key => new __Scale(key, [2, 4, 5, 7, 9, 11])
}

class __Scale {
	constructor(string, intervals) {
		this.fondamental = new Key(string, 0);
		this.intervals = intervals.map(x => new Interval(this.fondamental, new Key(this.fondamental.valueOf() + x)));
	}
}

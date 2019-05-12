let SYNTH = new Tone.PolySynth(7, Tone.Synth).toMaster();

const Color = {
	Major:{
		name:'Major',
		rel:'M',
		keys:[0, 4, 7]
	},
	Minor:{
		name:'Minor',
		rel:'m',
		keys:[0, 3, 7]
	},
	Dim:{
		name:'Dim',
		rel:'dim',
		keys:[0, 3, 6]
	},
	Seventh:{
		name:'Seventh',
		rel:'7',
		keys:[0, 4, 7, 10]
	},
	Fifth:{
		name:'Fifth',
		rel:'5',
		keys:[0, 7]
	},
	MajorSeventh:{
		name:'MajorSeventh',
		rel:'M7',
		keys:[0, 4, 7, 11]
	},
	MinorSeventh:{
		name:'MinorSeventh',
		rel:'m7',
		keys:[0, 3, 7, 10]
	},
	MinorMajorSeventh:{
		name:'MinorMajorSeventh',
		rel:'mM7',
		keys:[0, 3, 7, 11]
	},
	Sus4:{
		name:'Sus4',
		rel:'sus4',
		keys:[0, 5, 7]
	},
	Sus2:{
		name:'Sus2',
		rel:'sus2',
		keys:[0, 2, 7]
	},
	Sixth:{
		name:'Sixth',
		rel:'6',
		keys:[0, 4, 7, 9]
	},
	MinorSixth:{
		name:'MinorSixth',
		rel:'m6',
		keys:[0, 3, 7, 9]
	},
	Ninth:{
		name:'Ninth',
		rel:'9',
		keys:[0, 4, 7, 14]
	},
	MinorNinth:{
		name:'MinorNinth',
		rel:'m9',
		keys:[0, 3, 7, 14]
	},
	MajorNinth:{
		name:'MajorNinth',
		rel:'M9',
		keys:[0, 4, 7, 15]
	},
	MinorMajorNinth:{
		name:'MinorMajorNinth',
		rel:'mM9',
		keys:[0, 3, 7, 15]
	},
	Add9:{
		name:'Add9',
		rel:'add9',
		keys:[0, 2, 4, 7]
	}
};

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function createKey(value) {
	return new Key({
		string:KEYS[value % 12],
		octave:Math.trunc(value / 12)
	});
}

function getAllChords(key) {
	let list = [];

	for (let more in Color){
		let chord = new Chord({key:key, more:Color[more]});
		list.push(chord);
	}
	return list;
}

const Key = function(key) {
	let it = {};

	function build() {
		addIfNot(key, {
			string:'C',
			octave:1
		});
		addIfNot(it, key);

		it.value = KEYS.indexOf(it.string) + (it.octave * 12);
	}

	it.add = function(n) {
		it.value += n;
		if (it.value > 11) {
			it.octave += Math.trunc(it.value / 12);
			it.value = it.value % 12;
		}
		if (it.value < 0) {
			it.octave = 0;
			it.value = 0;
		}
		it.string = KEYS[it.value % 12];
	}

	it.equals = function(key) {
		return it.value == key.value;
	}

	it.getFullString = function() {
		return it.string+it.octave;
	}

	it.corresponds = function(key) {
		return it.string === key.string;
	}

	it.getRelatives = function(color) {
		if (color.name === Color.Major.name) {
			return [
				new createKey(it.value),
				new createKey(it.value + 2),
				new createKey(it.value + 4),
				new createKey(it.value + 5),
				new createKey(it.value + 7),
				new createKey(it.value + 9),
				new createKey(it.value + 11)
			];
		} else if (color.name === Color.Minor.name) {
			return [
				new createKey(it.value),
				new createKey(it.value + 2),
				new createKey(it.value + 3),
				new createKey(it.value + 5),
				new createKey(it.value + 7),
				new createKey(it.value + 8),
				new createKey(it.value + 10)
			];
		} else {
			console.error('Bad color for Chords : ' + color.name);
			return {};
		}
	}

	build();
	return it;
}

const Chord = function(chord) {
	let it = {};

	function build() {
		addIfNot(chord, {
			key:new Key({string:'C'}),
			more:Color.Major
		});
		addIfNot(it, chord);
		it.list = it.setList();
	}

	it.setList = function() {
		list = [];
		for (let add of it.more.keys)
			list.push(createKey(it.key.value + add));
		return list;
	}

	it.toString = function() {
		return it.key.string+it.more.rel;
	}

	it.getKeysArray = function() {
		let array = [];
		for (let key of it.list)
			array.push(key.getFullString());
		return array;
	}

	build();
	return it;
}

const Scale = function(scale) {
	let it = {};

	function build() {
		addIfNot(scale, { color:Color.Major, key:new Key('C')});
		addIfNot(it, scale);

		it.setChords();
	}

	it.setChords = function() {
		it.list = it.key.getRelatives(it.color);
	}

	it.getChordsStartingWith = function(key) {
		let allowed = [];
		let chords = getAllChords(key);

		for (let chord of chords) {
			if (it.allows(chord))
				allowed.push(chord);
		}
		return allowed;
	}

	it.allows = function(chord) {
		for (let key of chord.list) {
			let found = false;
			for (let reference of it.list) {
				if (reference.corresponds(key)) {
					found = true;
					break;
				}
			}
			if (!found) return false;
		}
		return true;
	}

	build();
	return it;
}
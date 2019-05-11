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

function merge(o, e) {
	if (!e) e = {};
	for (let entry in e)
		o[entry] = e[entry];
	return o;
}

const Key = function(key) {
	let it = {};

	function build() {
		key = merge({
			string:'C',
			octave:1
		}, key);
		it = merge(key, it);

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
				new Chord({key:createKey(it.value), more:Color.Major}),
				new Chord({key:createKey(it.value + 2), more:Color.Minor}),
				new Chord({key:createKey(it.value + 4), more:Color.Minor}),
				new Chord({key:createKey(it.value + 5), more:Color.Major}),
				new Chord({key:createKey(it.value + 7), more:Color.Major}),
				new Chord({key:createKey(it.value + 9), more:Color.Minor}),
				new Chord({key:createKey(it.value + 11), more:Color.Dim})
			];
		} else if (color.name === Color.Minor.name) {
			return [
				new Chord({key:createKey(it.value), more:Color.Minor}),
				new Chord({key:createKey(it.value + 2), more:Color.Dim}),
				new Chord({key:createKey(it.value + 3), more:Color.Major}),
				new Chord({key:createKey(it.value + 5), more:Color.Minor}),
				new Chord({key:createKey(it.value + 7), more:Color.Minor}),
				new Chord({key:createKey(it.value + 8), more:Color.Major}),
				new Chord({key:createKey(it.value + 10), more:Color.Major})
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
		chord = merge({
			key:new Key({string:'C'}),
			more:Color.Major
		}, chord);
		it = merge(chord, it);
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
		scale = merge({ color:Color.Major, key:new Key('C')}, scale);
		it = merge(scale, it);

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
				if (reference.key.corresponds(key)) {
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

function main() {
	let scale = new Scale({
		color:Color.Minor,
		key:new Key({string:'A', octave:3})
	});
	for (let chord of scale.list)
		Creator.createElement({
			parentNode:document.getElementById('keys'),
			content:chord.key.string,
			click:function(e) {
				printChords(chord.key, scale);
			}
		});
}

function printChords(key, scale) {
	let e = document.getElementById('chords');
	e.innerHTML = '';
	for (let chord of scale.getChordsStartingWith(key))
		Creator.createElement({
			parentNode:e,
			content:chord.toString(),
			click:function(e) {
				SYNTH.triggerAttackRelease(chord.getKeysArray(), "4n");
			}
		});
}

main();
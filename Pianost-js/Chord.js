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
			case 'aug' :
				array.push([new Key(key.value + 4), 'third-M']);
				array.push([new Key(key.value + 8), 'fifth']);
				break;
			case 'sus2' :
				array.push([new Key(key.value + 2), 'second']);
				array.push([new Key(key.value + 7), 'fifth']);
				break;
			case 'sus4' :
				array.push([new Key(key.value + 5), 'fourth']);
				array.push([new Key(key.value + 7), 'fifth']);
				break;
			case '7sus2' :
				array.push([new Key(key.value + 2), 'second']);
				array.push([new Key(key.value + 7), 'fifth']);
				array.push([new Key(key.value + 10), 'seventh-m']);
				break;
			case '7sus4' :
				array.push([new Key(key.value + 5), 'fourth']);
				array.push([new Key(key.value + 7), 'fifth']);
				array.push([new Key(key.value + 10), 'seventh-m']);
				break;
			case '6' :
				array.push([new Key(key.value + 4), 'third-M']);
				array.push([new Key(key.value + 7), 'fifth']);
				array.push([new Key(key.value + 9), 'sixth']);
				break;
			case '7' :
				array.push([new Key(key.value + 4), 'third-M']);
				array.push([new Key(key.value + 7), 'fifth']);
				array.push([new Key(key.value + 10), 'seventh-m']);
				break;
			case '9' :
				array.push([new Key(key.value + 4), 'third-M']);
				array.push([new Key(key.value + 7), 'fifth']);
				array.push([new Key(key.value + 10), 'seventh-m']);
				array.push([new Key(key.value + 14), 'second']);
				break;
			case 'M7' :
				array.push([new Key(key.value + 4), 'third-m']);
				array.push([new Key(key.value + 7), 'fifth-b']);
				array.push([new Key(key.value + 11), 'fifth-b']);
				break;
			case 'M9' :
				array.push([new Key(key.value + 4), 'third-m']);
				array.push([new Key(key.value + 7), 'fifth-b']);
				array.push([new Key(key.value + 11), 'fifth-b']);
				array.push([new Key(key.value + 14), 'fifth-b']);
				break;
			case 'M11' :
				array.push([new Key(key.value + 4), 'third-m']);
				array.push([new Key(key.value + 7), 'fifth-b']);
				array.push([new Key(key.value + 11), 'fifth-b']);
				array.push([new Key(key.value + 14), 'fifth-b']);
				array.push([new Key(key.value + 17), 'fifth-b']);
				break;
			case 'm6' :
				array.push([new Key(key.value + 3), 'third-m']);
				array.push([new Key(key.value + 7), 'fifth-b']);
				array.push([new Key(key.value + 9), 'fifth-b']);
				break;
			case 'm7' :
				array.push([new Key(key.value + 3), 'third-m']);
				array.push([new Key(key.value + 7), 'fifth-b']);
				array.push([new Key(key.value + 10), 'fifth-b']);
				break;
			case 'm9' :
				array.push([new Key(key.value + 3), 'third-m']);
				array.push([new Key(key.value + 7), 'fifth-b']);
				array.push([new Key(key.value + 10), 'fifth-b']);
				array.push([new Key(key.value + 14), 'fifth-b']);
				break;
			case 'm11' :
				array.push([new Key(key.value + 3), 'third-m']);
				array.push([new Key(key.value + 7), 'fifth-b']);
				array.push([new Key(key.value + 10), 'fifth-b']);
				array.push([new Key(key.value + 14), 'fifth-b']);
				array.push([new Key(key.value + 17), 'fifth-b']);
				break;
		}
		return array;
	}
	toString() {
		return this.key.keyString() + "" + this.more + " beginning at "+this.key.toString();
	}
	getChordString() {
		return this.key.keyString()+""+this.more;
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
	lessOctave() {
		for (let key of this.array) {
			key[0].lessOctave();
		}
	}
	moreOctave() {
		for (let key of this.array) {
			key[0].upperOctave();
		}
	}
	static getChords(keys) {
		let chord;
		let tup;
		let list = [];
		chord = new Chord(keys[0], ''); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'm'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'dim'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'aug'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'sus2'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'sus4'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], '7sus2'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], '7sus4'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], '6'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], '7'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], '9'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'M7'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'M9'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'M11'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'm6'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'm7'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'm9'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		chord = new Chord(keys[0], 'm11'); tup = Chord.missingNotes(chord, keys); if (tup) { list.push(tup); }
		return list;
	}

	accepts(key) {
		for (let note of this.array) {
			if (note[0].getKey() == key.getKey()) return true;
		}
		return false;
	}

	static missingNotes(chord, keys) {
		for (let key of keys)
			if (!chord.accepts(key)) return false;
		let missing = 0;
		for (let key of chord.array) {
			let found = false;
			for (let note of keys) {
				if (note.getKey() == key[0].getKey()) {
					found = true;
					break;
				}
			}
			if (!found)
				missing++;
		}
		return [chord, missing];
	}
}
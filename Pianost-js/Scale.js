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
	getChords(starting) {
		let chords = [];
		let key = new Key(this.key.value);
		switch (this.tonality) {
			case 'Major' :
				chords.push(new Chord(key.setOctave(starting), ''));
				chords.push(new Chord(new Key(key.value + 2).setOctave(starting), 'm'));
				chords.push(new Chord(new Key(key.value + 4).setOctave(starting), 'm'));
				chords.push(new Chord(new Key(key.value + 5).setOctave(starting), ''));
				chords.push(new Chord(new Key(key.value + 7).setOctave(starting), ''));
				chords.push(new Chord(new Key(key.value + 9).setOctave(starting), 'm'));
				chords.push(new Chord(new Key(key.value + 11).setOctave(starting), 'dim'));
				break;
			case 'Minor' :
				chords.push(new Chord(key.setOctave(starting), 'm'));
				chords.push(new Chord(new Key(key.value + 2).setOctave(starting), 'dim'));
				chords.push(new Chord(new Key(key.value + 3).setOctave(starting), ''));
				chords.push(new Chord(new Key(key.value + 5).setOctave(starting), 'm'));
				chords.push(new Chord(new Key(key.value + 7).setOctave(starting), 'm'));
				chords.push(new Chord(new Key(key.value + 8).setOctave(starting), ''));
				chords.push(new Chord(new Key(key.value + 10).setOctave(starting), ''));
				break;
		}

		return chords;
	}

	toString() {
		return "Scale of "+this.key.keyString()+" "+this.tonality;
	}
	minifiedString() {
		return this.key.keyString()+" "+this.tonality;
	}
	switchTonality() {
		this.tonality = (this.tonality == 'Major') ? 'Minor' : 'Major';
		this.array = Scale.getArray(this.key, this.tonality);
		return this;
	}
	static getAllScales() {
		let list = [];
		for (let i = 0; i < 12; i++)
			list.push(new Scale(new Key(i), 'Major'));
		return list;
	}
	getRelative() {
		if (this.tonality == 'Major')
			return new Scale(new Key(this.key.value + 9), 'Minor');
		else 
			return new Scale(new Key(this.key.value + 3), 'Major');
	}
	equals(scale) {
		return (this.tonality == scale.tonality && this.key.getKey() == scale.key.getKey());
	}
	accepts(key) {
		for (let scaleKey of this.array)
			if (scaleKey[0].getKey() == key.getKey())
				return true;
		return false;
	}
}
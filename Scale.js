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
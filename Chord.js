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
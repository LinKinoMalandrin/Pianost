let BOOK = 0;
let CHORDVIEWER = 0;
let SCALEVIEWER = 0;
let SCALEFINDER = 0;

class Book {
	constructor(element) {
		this.DOM = element;
		this.heads = this.DOM.getElementsByClassName('book-head')[0].getElementsByClassName('book-part');
		this.bodies = this.DOM.getElementsByClassName('book-body')[0].getElementsByClassName('book-part');
		this.currentPage = 0;
		this.switchPage(0);

		for (let i = 0; i < this.heads.length; i++) {
			let thisbis = this;
			this.heads[i].addEventListener('click', function(e) {
				thisbis.switchPage(i);
			});
		}
	}

	switchPage(i) {
		this.heads[this.currentPage].classList.remove('selected');
		this.bodies[this.currentPage].classList.remove('selected');
		this.heads[i].classList.add('selected');
		this.bodies[i].classList.add('selected');
		this.currentPage = i;
	}
}

class Switch {
	constructor(element, values) {
		this.current = 1;
		this.values = values;
		this.DOM = element;
		this.parts = this.DOM.getElementsByClassName('part');
		this.switch = this.DOM.getElementsByClassName('switch')[0];
		this.onchangefunction = function() {};

		let thisbis = this;
		this.switch.addEventListener('click', function (e) {
			thisbis.switchPart();
		});
		for (let i = 0; i < 2; i++)
			this.parts[i].addEventListener('click', function (e) {
				thisbis.selectPart(i);
			});
		this.switchPart();
	}

	selectPart(i) {
		if (i != this.current) this.switchPart();
	}

	switchPart() {
		if (this.current == 0) {
			this.switch.classList.remove('left');
			this.switch.classList.add('right');
			this.current = 1;
		} else {
			this.switch.classList.remove('right');
			this.switch.classList.add('left');
			this.current = 0;
		}
		this.change();
	}

	switchWithoutChange() {
		if (this.current == 0) {
			this.switch.classList.remove('left');
			this.switch.classList.add('right');
			this.current = 1;
		} else {
			this.switch.classList.remove('right');
			this.switch.classList.add('left');
			this.current = 0;
		}
	}

	getValue() {
		return this.values[this.current];
	}
	change() {
		this.onchangefunction();
	}
	onChange(callback) {
		this.onchangefunction = callback;
	}
}

class Button {
	constructor(element, onclick) {
		this.DOM = element;
		this.DOM.addEventListener('click', onclick);
	}
}

class ScaleViewer {
	constructor() {
		this.piano = new Piano(getId('PianoScaleViewer'), 3, 6);
		this.tonality = new Switch(getId('SwitchTonality'), ['Major', 'Minor']);
		this.scale = new Scale(new Key('C'), 'Major');
		this.name = getId("ScaleViewerName");
		this.setName();
		this.piano.selectScale(this.scale);

		this.showchords = new Button(getId('ShowScalesChords'), function (e) {
			BOOK.switchPage(1);
			CHORDVIEWER.selectScale(SCALEVIEWER.scale);
		});

		this.piano.addClickOnKeys(function (e, key, piano) {
			piano.clear();
			SCALEVIEWER.scale = new Scale(key, SCALEVIEWER.tonality.getValue());
			piano.selectScale(SCALEVIEWER.scale);
			SCALEVIEWER.setName();
		});

		this.tonality.onChange(function () {
			SCALEVIEWER.scale.switchTonality();
			SCALEVIEWER.piano.clear();
			SCALEVIEWER.piano.selectScale(SCALEVIEWER.scale);
			SCALEVIEWER.setName();
		});
	}

	selectScale(scale) {
		this.scale = scale;
		if (this.scale.tonality != this.tonality.getValue())
			this.tonality.switchWithoutChange();
		this.piano.clear();
		this.piano.selectScale(this.scale);
		this.setName();
	}

	setName() {
		this.name.innerHTML = this.scale.toString();
	}
}

class ChordViewer {
	constructor() {
		this.piano = new Piano(getId('PianoChordViewer'), 4, 5);
		this.starting = 4;
		this.scale = new Scale(new Key('C', 4), 'Major');
		this.chords = getId('ChordList');
		this.list = [];
		this.current = new Chord(new Key('C', 4), '');

		this.refreshChords();

		this.playchord = getId('PlayChord');
		this.switchstarting = getId('SwitchStarting');
		this.switchstartingright = getId('SwitchStartingRight');
		this.switchstartingleft = getId('SwitchStartingLeft');
		this.startings = this.switchstarting.getElementsByClassName('item');
		this.setSwitchStarting();

		addMouseUpDown(this.playchord, this);
		this.showChord();
	}

	refreshChords() {
		this.list = this.scale.getChords(this.starting);
		this.chords.getElementsByClassName('head')[0].innerHTML = this.scale.toString();
		let body = this.chords.getElementsByClassName('body')[0];
		body.innerHTML = "";
		for (let chord of this.list) {
			body.appendChild(ChordViewer.newChord(chord));
		}
		this.showChord();
	}
	static newChord(chord) {
		let e = createElement('div', 'item');
		e.innerHTML = chord.getChordString();
		e.addEventListener('click', function(e) {
			CHORDVIEWER.setCurrent(chord);
			CHORDVIEWER.showChord();
		});
		return e;
	}

	setCurrent(chord) {
		this.current = chord;
	}

	showChord() {
		this.piano.clear().selectChord(this.current);
		this.setChordName();
	}

	selectScale(scale) {
		this.scale = scale;
		this.refreshChords();
		this.current = this.list[0];
		this.showChord();
	}
	setSwitchStarting() {
		let thisbis = this;
		this.switchstartingleft.addEventListener('click', function (e) {
			if (thisbis.starting > 1)
				thisbis.startingLess();
		});
		this.switchstartingright.addEventListener('click', function (e) {
			if (thisbis.starting < 7)
				thisbis.startingMore();
		});
	}
	setChordName() {

	}

	startingMore() {
		this.startings[this.starting - 1].classList.remove('selected');
		this.startings[this.starting].classList.add('selected');
		this.starting++;
		this.current.moreOctave();
		this.refreshChords();
		this.refreshPiano();
		this.showChord();
	}
	startingLess() {
		this.startings[this.starting - 1].classList.remove('selected');
		this.startings[this.starting - 2].classList.add('selected');
		this.starting--;
		this.current.lessOctave();
		this.refreshChords();
		this.refreshPiano();
		this.showChord();
	}

	refreshPiano() {
		this.piano = new Piano(getId('PianoChordViewer'), this.starting, this.starting + 1);
	}

	play() {
		this.current.play();
	}
	stop() {
		this.current.stop();
	}
}

class ScaleFinder {
	constructor() {
		this.piano = new Piano(getId("PianoScaleFinder"), 3, 5);
		this.availableDOM = getId("ScalesAvailable");
		this.available = [];
		this.keys = [];
		this.scales = Scale.getAllScales();
		this.clearbutton = new Button(getId('ClearScaleFinder'), function (e) {
			SCALEFINDER.clear();
		});

		this.piano.addClickOnKeys(function (e, key, piano) {
			SCALEFINDER.clickOnKey(key);
		});
		this.printAvailables();
	}

	clickOnKey(key) {
		if (key.selected()) {
			for (let i = 0; i < this.keys.length; i++) {
				if (this.keys[i].toString() == key.toString()) {
					this.keys.splice(i, 1);
				}
			}
			key.clear();
		}
		else {
			key.select('find');
			this.keys.push(key);
		}
		this.refreshAvailable();
		this.printAvailables();
	}

	refreshAvailable() {
		this.available = [];
		if (this.keys.length == 0)
			return;
		else {
			for (let scale of this.scales) {
				let accept = true;
				for (let key of this.keys) {
					if (!(scale.accepts(key))) {
						accept = false;
						break;
					}
				}
				if (accept)
					this.available.push(scale);
			}
		}
	}
	printAvailables() {
		let body = this.availableDOM.getElementsByClassName('body')[0];
		let minor = body.getElementsByClassName('minor')[0];
		let major = body.getElementsByClassName('major')[0];

		major.innerHTML = "";
		minor.innerHTML = "";
		if (this.available.length == 0) {
			major.innerHTML = "No scale";
			minor.innerHTML = "found";
		}
		else {
			for (let scale of this.available) {
				let scaleDOM = ScaleFinder.newScale(scale);
				major.appendChild(scaleDOM[0]);
				minor.appendChild(scaleDOM[1]);
			}
		}
	}
	static newScale(scale) {
		let maj = createElement('div', 'item');
		maj.innerHTML = scale.minifiedString();
		let min = createElement('div', 'item');
		let rel = scale.getRelative()
		min.innerHTML = rel.minifiedString();
		min.addEventListener('click', function(e) {
			BOOK.switchPage(0);
			SCALEVIEWER.selectScale(rel);
		});
		maj.addEventListener('click', function(e) {
			BOOK.switchPage(0);
			SCALEVIEWER.selectScale(scale);
		});
		return [maj, min];
	}

	clear() {
		this.keys = [];
		this.piano.clear();
		this.refreshAvailable();
		this.printAvailables();
	}
}

class ChordFinder {
	constructor() {
		this.DOM = getId("ChordFinderContainer");
		this.piano = new Piano(getId("PianoChordFinder"), 3, 5);
		this.listDOM = getId("ChordsFound");
		this.colsDOM = [];
		this.colsDOM.push(this.listDOM.getElementsByClassName('zero')[0]);
		this.colsDOM.push(this.listDOM.getElementsByClassName('one')[0]);
		this.colsDOM.push(this.listDOM.getElementsByClassName('two')[0]);
		this.keys = [];
		this.found = [];
		this.playbutton = getId("PlayChordFind");
		addMouseUpDown(this.playbutton, this);


		this.piano.addClickOnKeys(function(e, key, piano) {
			CHORDFINDER.clickOnKey(key);
		});
	}

	clickOnKey(key) {
		if (key.selected()) {
			this.remove(key);
		} else {
			this.add(key);
		}
		if (this.keys.length > 2)
			this.printChords();
		else
			this.printEmpty();
	}
	remove(key) {
		key.clear();
		for (let i = 0; i < this.keys.length; i++) {
			if (this.keys[i].toString() == key.toString()) {
				this.keys.splice(i, 1);
				break;
			}
		}
		this.refreshList();
	}
	add(key) {
		key.select('chord');
		for (let i = 0; i < this.keys.length; i++) {
			if (this.keys[i].value > key.value) {
				this.keys.splice(i, 0, key);
				break;
			}
			if (i == this.keys.length - 1) {
				this.keys.push(key);
				break;
			}
		}
		if (this.keys.length == 0)
			this.keys.push(key);
		this.refreshList();
	}
	refreshList() {
		if (this.keys.length == 0) {
			this.found = [];
			return;
		}
		this.found = Chord.getChords(this.keys);
	}
	play() {
		for (let key of this.keys)
			key.play();
	}
	stop() {
		for (let key of this.keys)
			key.stop();
	}
	printChords() {
		this.colsDOM[0].innerHTML = "";
		this.colsDOM[1].innerHTML = "";
		this.colsDOM[2].innerHTML = "";
		for (let chord of this.found) {
			if (chord[1] > 2)
				continue;
			this.colsDOM[chord[1]].appendChild(ChordFinder.newChord(chord));
		}
	}
	printEmpty() {
		this.colsDOM[0].innerHTML = "";
		this.colsDOM[1].innerHTML = "";
		this.colsDOM[2].innerHTML = "";
	}
	static newChord(chord) {
		let e = createElement('div', 'item');
		e.innerHTML = chord[0].getChordString();
		return e;
	}
}

setup();

function setup() {
	BOOK = new Book(getId('Book'));
	SCALEVIEWER = new ScaleViewer();
	CHORDVIEWER = new ChordViewer();
	SCALEFINDER = new ScaleFinder();
	CHORDFINDER = new ChordFinder();
}





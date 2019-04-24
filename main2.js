let INFORMATION;
let MASTER;
let CHORDS;

const 	MODE_SCALE = 0,
		MODE_CHORD = 1,
		MODE_FIND = 2;

class Master extends Piano {
	constructor() {
		super(getId("PianoMaster"), 3, 5);
		this.keys = [];
		this.mode = MODE_SCALE;
		this.scale = new Scale();
		this.addClickOnKeys(function (e, key, piano) {
			MASTER.clickOnKey(key);
		});
	}
	clickOnKey(key) {
		if (this.mode == MODE_SCALE) this.showScale(key);
		if (this.mode == MODE_FIND) this.editKeys(key);
	}

	showScale(key) {

	}
}

class Chords {
	constructor() { 
		this.DOM = getId("Chords");
		this.scale = getClass(this.DOM, 'scale');
		this.chord = getClass(this.DOM, 'chord');
	}
}

class Information {
	constructor() { 
		this.scale = new Scale();
		this.chord = new Chord();
		this.DOM = getId("Information");

		let OBJ = this;
		this.front = {
			infos: OBJ,
			tonality: getClass(OBJ.DOM, 'tonality'),
			chord: getClass(OBJ.DOM, 'chord'),

			refresh() {
				this.tonality.innerHTML = this.infos.tonality.toString();
				this.chord.innerHTML = this.infos.chord.toString();
			}
		}

		this.front.refresh();
	}
}



setup();

function setup() {
	INFORMATION = new Information();
	MASTER = new Master();
	CHORDS = new Chords();
}
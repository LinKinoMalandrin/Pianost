let PARAMETERS;
let RACK;


const SCALE = function(parameters) {
	function build() {
		this.tonality = 1;
	}
	build();
	return this;
};

const NOTES = function(parameters) {
	function build() {

	}
	build();
	return this;
};

const MORE = function(parameters) {
	function build() {

	}
	build();
	return this;
};

PARAMETERS = (function() {
	function build() {
		this.scale = new SCALE(this);
		this.notes = new NOTES(this);
		this.more = new MORE(this);
	}

	build();
	return this;
})();

RACK = (function() {
	function build() {
		
	}
	build();
	return this;
})();

let scale = new Scale({
	color:Scales.Blues,
	key:new Key({string:'E', octave:3})
});

let keys = getId('keys');

function refreshList() {
	keys.innerHTML = '';
	for (let key of scale.list)
		Creator.createElement({
			parentNode:keys,
			classList:['key', 'touch'],
			click:function() {
				printChords(key);
			},
			contains:{ tag:'p', content:key.string }
		});
}


function printChords(key) {
	let chords = getId('chords');
	chords.innerHTML = "";
	for (let chord of scale.getChordsStartingWith(key))
		Creator.createElement({
			classList:['touch'],
			contains:{ tag:'p', content:chord.toString() },
			parentNode:chords,
			click:function() {
				printKeys(chord);
				SYNTH.triggerAttackRelease(chord.getKeysArray(), '8n');
			}
		});
}

function printKeys(chord) {
	Rack.putChord(chord);
}

let starting = getId('starting');
let dragStarting = new Level.YMouseDown(starting, {
	from:0,
	to:300,
	step:1
});
dragStarting.addOnChange(function() {
	starting.innerHTML = KEYS[Math.round(dragStarting.percentage() * 11)];
	scale = new Scale({
		key:new Key({
			string:KEYS[Math.round(dragStarting.percentage() * 11)],
			octave:3}), 
		color:Scales.Minor
	});
	refreshList();
});
dragStarting.change();

refreshList();
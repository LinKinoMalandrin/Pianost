let KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let SYNTH = new Tone.PolySynth(7, Tone.Synth).toMaster();

function createElement(type, classlist="") {
	let e = document.createElement(type);
	if (Array.isArray(classlist)) e.classList = classlist;
	else e.className = classlist;
	return e;
}

function addMouseUpDown(element, playable) {
	element.addEventListener('mousedown', function (e) {
		playable.play();
	});
	element.addEventListener('mouseup', function (e) {
		playable.stop();
	});
}
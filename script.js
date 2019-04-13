let KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let GAM = "Major";
let CURRENT = 'C';
let offset = 512;
let CURRENT_CHORD = [];
let CURRENT_FOND = "";
let CURRENT_MORE = "";
let STARTING = 4;
let INSTRUMENT = 'Synth';
let SYNTH = new Tone.PolySynth(7, Tone.Synth).toMaster();
let WAVE = new Tone.Waveform(offset);
SYNTH.connect(WAVE);
setTimeout(refreshWave, 50);

setBubbles();
generateAudioImports();


appendPiano(
	document.getElementById('SCALEBODY').getElementsByClassName('piano-container')[0],
	1,
	10,
	function (e, key, i) {
		triggerKey(key+i);
	},
	function (e, key, i) {
		releaseKey(key+i);
	}
);

let buttonPlayChord = document.getElementById('PLAYCHORD');
buttonPlayChord.addEventListener('mousedown', function (e) {
	triggerKeys(CURRENT_CHORD);
});
buttonPlayChord.addEventListener('mouseup', function (e) {
	releaseKeys(CURRENT_CHORD);
});

function toggleKeys(key) {
	if (key != CURRENT) {
		document.getElementById("sel-"+CURRENT).classList.remove('selected');
		document.getElementById("sel-"+key).classList.add('selected');
		CURRENT = key;
	}


	let toColor = getScale(key);
	
	printChords();
}


function getScale(key) {
	if (GAM === 'Major')
		return getMajor(key);
	else if (GAM === 'Minor')
		return getMinor(key);
}

function getMajor(key) {
	let index = KEYS.indexOf(key);
	let array = [key];

	array.push(KEYS[(index + 2) % KEYS.length]);
	array.push(KEYS[(index + 4) % KEYS.length]);
	array.push(KEYS[(index + 5) % KEYS.length]);
	array.push(KEYS[(index + 7) % KEYS.length]);
	array.push(KEYS[(index + 9) % KEYS.length]);
	array.push(KEYS[(index + 11) % KEYS.length]);

	return array;
}

function getMinor(key) {
	let index = KEYS.indexOf(key);
	return getMajor(KEYS[(index + 3) % KEYS.length]);
}

function changeSelection() {
	let select = document.getElementById("SELECT");
	if (select.classList.contains('left')) {
		select.classList.remove('left');
		select.classList.add('right');
		GAM = 'Minor';
		toggleKeys(CURRENT);
	} else if (select.classList.contains('right')) {
		select.classList.remove('right');
		select.classList.add('left');
		GAM = 'Major';
		toggleKeys(CURRENT);
	}
}

function printChords() {
	let chords = document.getElementById('CHORDS').getElementsByClassName('content')[0];
	let index = KEYS.indexOf(CURRENT);
	chords.innerHTML = "";

	if (GAM == 'Minor') {
		printChord(chords, CURRENT, 'm');
		printChord(chords, KEYS[(index + 3) % 12], '');
		printChord(chords, KEYS[(index + 5) % 12], 'm');
		printChord(chords, KEYS[(index + 7) % 12], 'm');
		printChord(chords, KEYS[(index + 8) % 12], '');
		printChord(chords, KEYS[(index + 10) % 12], '');
		printChord(chords, KEYS[(index + 2) % 12], 'dim');
	} else if (GAM == 'Major') {
		printChord(chords, CURRENT, '');
		printChord(chords, KEYS[(index + 2) % 12], 'm');
		printChord(chords, KEYS[(index + 4) % 12], 'm');
		printChord(chords, KEYS[(index + 5) % 12], '');
		printChord(chords, KEYS[(index + 7) % 12], '');
		printChord(chords, KEYS[(index + 9) % 12], 'm');
		printChord(chords, KEYS[(index + 11) % 12], 'dim');
	}
}

function printChord(chords, chord, more) {
	let array = getChordArray(chord, more);
	let noteSplit = chord.split('');

	let row = createElement('div', 'chord');
	row.innerHTML = (noteSplit.length == 1) ? 
		"<p>"+noteSplit[0]+"<span class='more'>"+more+"</span></p>" :
		"<p>"+noteSplit[0]+"<span class='diese'>"+noteSplit[1]+"</span><span class='more'>"+more+"</span></p>";
		console.log(chord);
	row.addEventListener('click', function (e) {
		printChordInViewer(chord, more, array);
		CURRENT_FOND = chord;
		CURRENT_MORE = more;
		let c = document.getElementById('CHORD');
		c.style.display = 'flex';
	});
	chords.appendChild(row);
}

function printChordInViewer(chord, more, array) {
	let view = document.getElementById('CHORD');
	let head = view.getElementsByClassName('head')[0];
	let piano = view.getElementsByClassName('piano-container')[0];
	let button = view.getElementsByClassName('button')[0];

	let ns = chord.split('');
	head.innerHTML = (ns.length == 1) ? 
		"<p>"+ns[0]+"<span class='more'>"+more+"</span></p>" :
		"<p>"+ns[0]+"<span class='diese'>"+ns[1]+"</span><span class='more'>"+more+"</span></p>";

	piano.innerHTML = "";
	appendLittlePiano(piano, STARTING, STARTING+1, function (e, key, i) {
			triggerKey(key+i);
		},
		function (e, key, i) {
			releaseKey(key+i);
		});
	let find = findOrder(array, STARTING);
	let ar = getChordArray(chord, more);
	CURRENT_CHORD = find;
	console.log(find);
	console.log(ar);
	for (let i = 0; i < find.length; i++) {
		piano.getElementsByClassName(find[i])[0].classList.add('selected');
		piano.getElementsByClassName(find[i])[0].setAttribute('nth', ar[i][1]);
	}

}

function createElement(type, classlist="") {
	let e = document.createElement(type);
	if (Array.isArray(classlist)) e.classList = classlist;
	else e.className = classlist;
	return e;
}

function playKey(key) {
	if (INSTRUMENT == 'Piano') {
		let audio = document.getElementById('audio-'+key);
		audio.currentTime = 0;
		audio.play();
	} else {
		SYNTH.triggerAttackRelease([key], "8n");
	}
}

function playChord(array) {
	if (INSTRUMENT == 'Piano') {
		for (let note of array) {
			playKey(note);
		}
	} else {
		SYNTH.triggerAttackRelease(array, "8n");
		setTimeout(refreshWave, 50);
	}	
}

function showPart(swtch, part, button) {
	let swtchElement = document.getElementById(swtch);

	for (let link of swtchElement.getElementsByClassName('link')) {
		link.classList.remove('selected');
	}
	button.classList.add('selected');
	for (let part of swtchElement.getElementsByClassName('part')) {
		part.classList.remove('selected');
	}
	document.getElementById(part).classList.add('selected');
}

function getChordArray(fondamentale, more) {
	let array = [[fondamentale, 'first']];
	let i = KEYS.indexOf(fondamentale);
	if (more == '') {
		array.push([KEYS[(i + 4) % 12], 'third-M']);
		array.push([KEYS[(i + 7) % 12], 'fifth']);

	} else if (more == 'm') {
		array.push([KEYS[(i + 3) % 12], 'third-m']);
		array.push([KEYS[(i + 7) % 12], 'fifth']);

	} else if (more == 'dim') {
		array.push([KEYS[(i + 3) % 12], 'third-m']);
		array.push([KEYS[(i + 6) % 12], 'fifth-dim']);

	}
	return array;
}

function findOrder(array, starting) {
	let toReturn = [];
	let index = 0;
	let previousIndex = 0;
	for (let i = 0; i < array.length; i++) {
		index = KEYS.indexOf(array[i][0]);
		if (index < previousIndex) {
			starting++;
		}
		previousIndex = index;
		toReturn.push(array[i][0]+""+starting);
	}
	return toReturn;
}

function switchInstrument(button) {
	if (button.classList.contains('left')) {
		button.classList.remove('left');
		button.classList.add('right');
		INSTRUMENT = 'Synth';
	} else if (button.classList.contains('right')) {
		button.classList.remove('right');
		button.classList.add('left');
		INSTRUMENT = 'Piano';
	}
}

function switchTheme(button) {
	if (button.classList.contains('left')) {
		button.classList.remove('left');
		button.classList.add('right');
		document.body.classList.add('dark');
	} else if (button.classList.contains('right')) {
		button.classList.remove('right');
		button.classList.add('left');
		document.body.classList.remove('dark');
	}
}

function verifyInputBPM(input) {
	let value = input.value;
	if (value == "" || !(/^\d+$/.test(value)) || value.length > 3) {
		input.classList.add('error');
	} else {
		input.classList.remove('error');
	}
}

function setPianoChord() {
	let e = document.getElementById("PIANOCHORD");
	appendPiano(e, 1, 10, 
		function (e, key, i) {
			triggerKey(key+i);
		},
		function (e, key, i) {
			releaseKey(key+i);
		});
}

function setBubbles() {
	let e = document.getElementById('WAVEFORM');

	for (let i = 0; i < offset; i++) {
		e.innerHTML += "<div class='bubble' id='bubble-"+i+"'></div>";
	}
}

function refreshWave() {
	let floats = WAVE.getValue();
	for (let i = 0; i < offset; i++) {
		document.getElementById("bubble-"+i).style.transform = "translateY("+parseInt(floats[i] * 100)+"px)";
	}
	setTimeout(refreshWave, 10);
}

function triggerKey(key) {
	SYNTH.triggerAttack([key], undefined, 1);
}
function releaseKey(key) {
	SYNTH.triggerRelease([key]);
}
function triggerKeys(keys) {
	SYNTH.triggerAttack(keys, undefined, 1);
}
function releaseKeys(keys) {
	SYNTH.triggerRelease(keys);
}

function generateAudioImports() {
	let e = document.getElementById('AUDIOIMPORTS');
	let notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
	let dieses = ['C', 'D', 'F', 'G', 'A'];
	let inner = "";
	for (let i = 1; i < 10; i++) {
		for (let key of notes) inner += "<audio src='audio/"+key+"5.mp3' id='audio-"+key+"5'></audio>\n";
		for (let key of dieses) inner += "<audio src='audio/"+key+"d5.mp3' id='audio-"+key+"#5'></audio>\n";
	}
	e.innerHTML += inner;
}

function appendPiano(e, from, to, mousedown=undefined, mouseup=undefined) {
	
	let dieses = [['C#', 'D#'], ['F#', 'G#', 'A#']];
	let notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

	for (let i = from; i < (to + 1); i++) {
		let piano = document.createElement('div');
		piano.className = 'piano';
		let black = document.createElement('div');
		black.className = 'black';
		let container = document.createElement('div');
		container.className = 'container';

		for (let key of dieses[0])
			container.appendChild(newKey(key, i, mouseup, mousedown));

		black.appendChild(container);
		container = document.createElement('div');
		container.className = 'container';

		for (let key of dieses[1])
			container.appendChild(newKey(key, i, mouseup, mousedown));

		black.appendChild(container);
		piano.appendChild(black);

		let white = document.createElement('div');
		white.className = 'white';
		for (let key of notes)
			white.appendChild(newKey(key, i, mouseup, mousedown));

		piano.appendChild(white);
		e.appendChild(piano);
	}
}
function appendLittlePiano(e, from, to, mousedown=undefined, mouseup=undefined) {
	
	let dieses = [['C#', 'D#'], ['F#', 'G#', 'A#']];
	let notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

	for (let i = from; i < (to + 1); i++) {
		let piano = document.createElement('div');
		piano.className = 'piano-little';
		let black = document.createElement('div');
		black.className = 'black';
		let container = document.createElement('div');
		container.className = 'container';

		for (let key of dieses[0])
			container.appendChild(newKey(key, i, mouseup, mousedown));

		black.appendChild(container);
		container = document.createElement('div');
		container.className = 'container';

		for (let key of dieses[1])
			container.appendChild(newKey(key, i, mouseup, mousedown));

		black.appendChild(container);
		piano.appendChild(black);

		let white = document.createElement('div');
		white.className = 'white';
		for (let key of notes)
			white.appendChild(newKey(key, i, mouseup, mousedown));

		piano.appendChild(white);
		e.appendChild(piano);
	}
}
function newKey(key, i, mouseup, mousedown) {
	let keyE = document.createElement('div');
	keyE.classList.add('key');
	keyE.classList.add('key-'+key);
	keyE.classList.add(key+""+i);
	keyE.innerHTML = key+i;
	if (mousedown != undefined) keyE.addEventListener('mousedown', function (e) { mousedown(e, key, i); });
	if (mouseup != undefined) keyE.addEventListener('mouseup', function (e) { mouseup(e, key, i); });
	return keyE;
}

function startingMore() {
	if (STARTING == 8) return;
	document.getElementsByClassName('opt-'+STARTING)[0].classList.remove('selected');
	STARTING++;
	document.getElementsByClassName('opt-'+STARTING)[0].classList.add('selected');
	
	refreshChord();
}

function startingLess() {
	if (STARTING == 1) return;
	document.getElementsByClassName('opt-'+STARTING)[0].classList.remove('selected');
	STARTING--;
	document.getElementsByClassName('opt-'+STARTING)[0].classList.add('selected');
	
	refreshChord();
}

function refreshChord() {
	printChordInViewer(CURRENT_FOND, CURRENT_MORE, getChordArray(CURRENT_FOND, CURRENT_MORE));
}

function showScale() {
	let modal = document.getElementById('SCALE');
	modal.style.display = 'flex';
	let scale = document.getElementById('SCALEBODY');
	scale.getElementsByClassName('head')[0].innerHTML = "Scale of "+CURRENT+" "+GAM;
	let piano = scale.getElementsByClassName('piano-container')[0];
	setScaleKeys();
	window.onclick = function (e) {
		if (e.target == modal) {
			modal.style.display = 'none';
		}
	}
}

function setScaleKeys() {
	let piano = document.getElementById('SCALEBODY').getElementsByClassName('piano-container')[0];
	for (key of piano.getElementsByClassName('key')) {
		key.classList.remove('selected');
	}
	let scaleKeys = [];
	if (GAM == 'Major') {
		scaleKeys = getMajor(CURRENT);
		for (scaleKey of scaleKeys) {
			for (key of piano.getElementsByClassName('key-'+scaleKey)) { key.classList.add('selected'); key.setAttribute('nth', 'sixth'); }
		}
	} else if (GAM == 'Minor') {
		scaleKeys = getMinor(CURRENT);
		for (scaleKey of scaleKeys) {
			for (key of piano.getElementsByClassName('key-'+scaleKey)) { key.classList.add('selected'); key.setAttribute('nth', 'sixth'); }
		}
	}
}
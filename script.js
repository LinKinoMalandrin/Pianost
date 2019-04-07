let KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let GAM = "Major";
let CURRENT = 'C';
let CURRENT_CHORD = [];
let STARTING = 4;
let INSTRUMENT = 'Piano';
let SYNTH = new Tone.PolySynth().toMaster();

let scrollDiv = document.getElementById("VOLUMEDRAG");
scrollDiv.addEventListener("click", function(e) {
	let x = e.clientX;
	let el = e.getBoundingClientRect();
	let percentage = (x - el.left) / el.width;
	scrollDiv.getElementsByClassName('level')[0].style.translateX = x;
});

function toggleKeys(key) {
	if (key != CURRENT) {
		document.getElementById("sel-"+CURRENT).classList.remove('selected');
		document.getElementById("sel-"+key).classList.add('selected');
		CURRENT = key;
	}
	let piano = document.getElementById('PIANO');

	let toColor = [];
	if (GAM === 'Major')
		toColor = getMajor(key);
	else if (GAM === 'Minor')
		toColor = getMinor(key);

	for (let key of piano.getElementsByClassName('key')) {
		key.classList.remove('selected');
		key.classList.remove('chord');
	}
	for (let key of toColor)
		for (let note of piano.getElementsByClassName(key))
			note.classList.add('selected');
	printChords();
}

function getMajor(key) {
	let index = KEYS.indexOf(key);
	let array = [key];

	array.push(KEYS[(index + 5) % KEYS.length]);

	for (let count = 0; count < 5; count++) {
		index = (index + 7) % KEYS.length;
		array.push(KEYS[index]);
	}

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
	let array = getNotes(chord, more);
	let noteSplit = chord.split('');
	if (noteSplit.length == 2)
		chords.innerHTML += "<div class='chord' onclick=\"changeChord(\'"+chord+"\', \'"+more+"\', 4)\"><p>"
	+noteSplit[0]+"<span class='diese'>"+noteSplit[1]+"</span><span class='more'>"+more+"</span></p>\n";
	else
		chords.innerHTML += "<div class='chord' onclick=\"changeChord(\'"+chord+"\', \'"+more+"\', 4)\"><p>"
	+noteSplit[0]+"<span class='more'>"+more+"</span></p>\n";
}

function getNotes(fondamental, plus) {
	let array = "['"+fondamental+"'";
	let i = KEYS.indexOf(fondamental);

	if (plus == '') {
		array += ", '"+KEYS[(i + 4) % 12]+"'";
		array += ", '"+KEYS[(i + 7) % 12]+"'";
	} else if (plus == 'm') {
		array += ", '"+KEYS[(i + 3) % 12]+"'";
		array += ", '"+KEYS[(i + 7) % 12]+"'";
	} else if (plus == 'dim') {
		array += ", '"+KEYS[(i + 3) % 12]+"'";
		array += ", '"+KEYS[(i + 6) % 12]+"'";
	} else if (plus == '5') {
		array += ", '"+KEYS[(i + 7) % 12]+"'";
	}
	array += "]";
	return array;
}

function changeChord(chord, more) {
	let chordWithoutOrder = getChordArray(chord, more);
	CURRENT_CHORD = chordWithoutOrder;

	let starting = STARTING;

	let chordsKeys = findOrder(chordWithoutOrder, starting);

	let chordEl = document.getElementById('CHORD');

	for (let key of chordEl.getElementsByClassName('key')) {
		key.classList.remove('chord');
		for (let note of chordsKeys) {
			if (key.classList.contains(note))
				key.classList.add('chord');
		}
	}

	document.getElementById('PLAY').onclick = function() { playChord(chordsKeys); };
}

function showChord() {
	let chordsKeys = findOrder(CURRENT_CHORD, STARTING);

	let chordEl = document.getElementById('CHORD');

	for (let key of chordEl.getElementsByClassName('key')) {
		key.classList.remove('chord');
		for (let note of chordsKeys) {
			if (key.classList.contains(note))
				key.classList.add('chord');
		}
	}

	document.getElementById('PLAY').onclick = function() { playChord(chordsKeys); };
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
	let array = [fondamentale];
	let i = KEYS.indexOf(fondamentale);
	if (more == '') {
		array.push(KEYS[(i + 4) % 12]);
		array.push(KEYS[(i + 7) % 12]);

	} else if (more == 'm') {
		array.push(KEYS[(i + 3) % 12]);
		array.push(KEYS[(i + 7) % 12]);

	} else if (more == 'dim') {
		array.push(KEYS[(i + 3) % 12]);
		array.push(KEYS[(i + 6) % 12]);

	}
	return array;
}

function findOrder(array, starting) {
	let toReturn = [];
	let index = 0;
	let previousIndex = 0;
	for (let i = 0; i < array.length; i++) {
		index = KEYS.indexOf(array[i]);
		if (index < previousIndex) {
			starting++;
		}
		previousIndex = index;
		toReturn.push(array[i]+""+starting);
	}
	return toReturn;
}

function switchStarting(option) {
	STARTING = parseInt(option.getAttribute('value'));
	for (let choice of document.getElementById('SELECTSTARTING').getElementsByClassName('choice'))
		choice.classList.remove('selected');
	option.classList.add('selected');
	showChord();
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

function verifyInputBPM(input) {
	let value = input.value;
	if (value == "" || !(/^\d+$/.test(value)) || value.length > 3) {
		input.classList.add('error');
	} else {
		input.classList.remove('error');
	}
}
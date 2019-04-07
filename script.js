let KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let GAM = "Major";
let CURRENT = 'C';


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
	let chords = document.getElementById('CHORDS');
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
		chords.innerHTML += "<div class='chord' onclick=\"showChord(\'"+chord+"\', \'"+more+"\')\"><p>"
	+noteSplit[0]+"<span class='diese'>"+noteSplit[1]+"</span><span class='more'>"+more+"</span></p><div class='play' onclick=\"playChord("+array+")\">F</div>\n";
	else
		chords.innerHTML += "<div class='chord' onclick=\"showChord(\'"+chord+"\', \'"+more+"\')\"><p>"
	+noteSplit[0]+"<span class='more'>"+more+"</span></p><div class='play' onclick=\"playChord("+array+")\">F</div>\n";
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

function showChord(chord, more) {

	let chordsKeys = [chord];

	if (more == '') {
		chordsKeys.push(KEYS[(KEYS.indexOf(chord) + 4) % 12]);
		chordsKeys.push(KEYS[(KEYS.indexOf(chord) + 7) % 12]);
	} else if (more == 'm') {
		chordsKeys.push(KEYS[(KEYS.indexOf(chord) + 3) % 12]);
		chordsKeys.push(KEYS[(KEYS.indexOf(chord) + 7) % 12]);
	} else if (more == '5') {
		chordsKeys.push(KEYS[(KEYS.indexOf(chord) + 7) % 12]);
	} else if (more == 'dim') {
		chordsKeys.push(KEYS[(KEYS.indexOf(chord) + 3) % 12]);
		chordsKeys.push(KEYS[(KEYS.indexOf(chord) + 6) % 12]);
	}

	let keys = document.getElementsByClassName('key');
	for (let key of keys) {
		key.classList.remove('chord');
		for (let note of chordsKeys)
			if (key.classList.contains(note))
				key.classList.add('chord');
	}
}

function playKey(key) {
	let audio = document.getElementById('audio-'+key);
	audio.currentTime = 0;
	audio.play();
}

function playChord(array) {
	for (let note of array) {
		playKey(note);
	}
}
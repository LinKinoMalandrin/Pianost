setup();

function setup() {
	generateAudioImports();
}

function generateAudioImports() {
	let e = document.getElementById('AUDIOIMPORTS');
	let notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
	let dieses = ['C', 'D', 'F', 'G', 'A'];
	let inner = "";
	for (let i = 1; i < 10; i++) {
		for (let key of notes) inner += "<audio src='audio/"+note+"5.mp3' id='audio-"+note+"5'></audio>\n";
		for (let key of dieses) inner += "<audio src='audio/"+note+"d5.mp3' id='audio-"+note+"#5'></audio>\n";
	}
	e.innerHTML += inner;
}

function appendPiano(e, from, to, mousedown=undefined, mouseup=undefined) {
	
	let dieses = [['C#', 'D#'], ['F#', 'G#', 'A#']];
	let notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

	for (let i = from; i < (to + 1); i++) {
		let piano = document.createElement('div').className = 'piano';
		let black = document.createElement('div').className = 'black';
		let container = document.createElement('div').className = 'container';

		for (let key of dieses[0]){
			let keyE = document.createElement('div').className = 'key';
			keyE.innerHTML = key;
			if (mousedown != undefined) keyE.addEventListener('mousedown', mousedown(e, key, i));
			if (mouseup != undefined) keyE.addEventListener('mouseup', mouseup(e, key, i));
			container.appendChild(keyE);
		}
		black.appendChild(container);
		container = document.createElement('div').className = 'container';
		for (let key of dieses[1]){
			let keyE = document.createElement('div').className = 'key';
			keyE.innerHTML = key;
			if (mousedown != undefined) keyE.addEventListener('mousedown', mousedown(e, key, i));
			if (mouseup != undefined) keyE.addEventListener('mouseup', mouseup(e, key, i));
			container.appendChild(keyE);
		}
		black.appendChild(container);
		piano.appendChild(black);

		let white = document.createElement('div').className = 'white';
		for (let key of notes){
			let keyE = document.createElement('div').className = 'key';
			keyE.innerHTML = key;
			if (mousedown != undefined) keyE.addEventListener('mousedown', mousedown(e, key, i));
			if (mouseup != undefined) keyE.addEventListener('mouseup', mouseup(e, key, i));
			container.appendChild(keyE);
		}
		piano.appendChild(white);
		a.appendChild(piano);
	}
}
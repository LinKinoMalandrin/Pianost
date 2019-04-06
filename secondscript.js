function toggleKeys(key) {
	let piano = document.getElementById('PIANO');

	let toColor = [];
	if (GAM === 'Major')
		toColor = getMajor(key);
	else if (GAM === 'Minor')
		toColor = getMinor(key);

	for (let key of piano.getElementsByClassName('key'))
		key.classList.remove('selected');
	for (let key of toColor)
		for (let note of piano.getElementsByClassName(key))
			note.classList.add('selected');
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
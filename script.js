let KEYS = ['C', 'Cd', 'D', 'Dd', 'E', 'F', 'Fd', 'G', 'Gd', 'A', 'Ad', 'B'];

function toggleKeys(key) {
	let piano = document.getElementById('PIANO');
	let toColor = getMajor(key);
	for (let key of piano.getElementsByClassName('key'))
		key.classList.remove('selected');


}

function getMajor(key) {
	
}
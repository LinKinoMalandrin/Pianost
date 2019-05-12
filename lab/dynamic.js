let scale = new Scale({
	color:Color.Minor,
	key:new Key({string:'E', octave:3})
});

let keys = getId('keys');

for (let key of scale.list)
	Creator.createElement({
		parentNode:keys,
		classList:['key'],
		click:function() {
			printChords(key);
		},
		content:key.string
	});

function printChords(key) {
	let chords = getId('chords');
	chords.innerHTML = "";
	for (let chord of scale.getChordsStartingWith(key))
		Creator.createElement({
			content:chord.toString(),
			parentNode:chords,
			click:function() {
				printKeys(chord);
			}
		});
}

function printKeys(chord) {
	let chordE = getId('chord');
	chordE.innerHTML = '';
	for (let key of chord.list)
		Creator.createElement({
			content:key.string,
			parentNode:chordE
		});
}
let keys = [];

let Synth = new Tone.PolySynth(7, Tone.Synth).toMaster();

for (let i = 0; i < 8; i++)
	for (let k of Keys.all)
		keys.push(new Key(k, i));

let base = keys[24];
base.selected = true;

const vue = new Vue({
	el: '#app',
	data : {
		keys:keys,
		chord:[base],
		base:base
	}
});

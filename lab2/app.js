let base = new Key('C', 2);

const vue = new Vue({
	el: '#app',
	data : {
		base: base,
		whites : Keys.whites,
		blacks : Keys.blacks,
		scale : Scale.Major('C'),
		chord : [base]
	},
	methods : {
		stringKey : function(s, o) {
			return new Key(s, o).string;
		}, 
		inChord : function(k, n) {
			return this.chord.find((x) => { return x.string === this.stringKey(k, n) });
		}
	}
});

console.log(vue.keys);
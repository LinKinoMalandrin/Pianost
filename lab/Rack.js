const Rack = ( function() {
	function build() {
		this.e = getId('rack');
		this.keys = this.instanciateKeys();
		this.racks = instanciateRacks();
	}

	this.instanciateKeys = function() {
		let keys = getId('rack-keys');
		list = [];
		for (let c = 5; c > 2; c--) {
			for (let i = KEYS.length - 1; i > -1; i--) {
				let color = (KEYS[i].length > 1) ? 'black' : 'white';
				list.push(Creator.createElement({
					parentNode:keys,
					content:KEYS[i]+c,
					id:'key_'+KEYS[i]+c,
					classList:[color],
					click:function(e) {
						SYNTH.triggerAttackRelease(KEYS[i]+c, '8n');
					}
				}));
			}
		}
		return list;
	}

	this.instanciateRacks = function() {
		let racks = getId('rack-racks');
		let list = [];
		for (let c = 5; c > 2; c--) {
			for (let i = KEYS.length - 1; i > -1; i--) {
				let color = (KEYS[i].length > 1) ? 'black' : 'white';
				list.push(Creator.createElement({
					parentNode:racks,
					id:'rack_'+KEYS[i]+c,
					classList:[color]
				}));
			}
		}
		return list;
	}

	this.putChord = function(chord) {
		this.clear();
		for (let key of chord.list) {
			Creator.createElement({
				parentNode:getId('rack_'+key.string+key.octave),
				classList:['note'],
				content:key.string+key.octave,
				click:function(e) {
					SYNTH.triggerAttackRelease(key.string+key.octave, '8n');
				}
			});
		}
	}

	this.clear = function() {
		for (let rack of this.racks)
			rack.innerHTML = '';
	}

	build();
	return this;
})();
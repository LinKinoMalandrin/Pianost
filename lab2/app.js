const vue = new Vue({
	el: '#app',
	data : {
		whites : Keys.whites,
		blacks : Keys.blacks,
		input : 'C0 E0 G0'
	}
});

console.log(vue.keys);
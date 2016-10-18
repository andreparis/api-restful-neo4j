var hash = module.exports = {
	_generate: function (array) {
		var hash = '', 
		key = array.toString().split(','),
		caracterAscIIstart = 65;
		if (array.length == 0) return 0;
		for (i = 0; i < (key.length-1); i++) {
			int = parseInt(key[i]+key[i+1])+caracterAscIIstart;
			char = String.fromCharCode(int);
			hash = hash + char
			i++;
		}
		hash = hash;
		return hash;
	}
}
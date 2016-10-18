

var downloads = module.exports = {

	_findOneGraph: function (object, key, i) {
		var node = "";
		while (key == object[i].key) {
				nodes = object[i].node+" "+object[i+1].node;
				string = string+nodes+"  ";
				i+=2;
				if (i == object.length)
					break;
		}
		return node;
	},

	convertToEL: function (object) {
		var string = "", key = "", nodes = "", number = 0;
		for (var i = 0; i < object.length;) {
			key = object[i].key;
			while (key == object[i].key) {
				nodes = object[i].node+" "+object[i+1].node;
				string = string+nodes+"  ";
				i+=2;
				if (i == object.length)
					break;
			}
			string = string+"\n";
			number++;
		}
		return {
			'graphs': string,
			'count': number
		};
	},
	getPropValue: function (object) {
		var results;
		for (var i = 0; i < object.colums.length; i++) {
			results[object.colums[i]] = [];
			for (var j = 0; j < object.data.length; j++) {
				results[object.colums[i]].push(object.data[j].row[i]);
			}
		}
	},
}
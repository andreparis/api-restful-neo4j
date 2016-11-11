var q = require('q');

var utilities = module.exports = {
    
    _generateRadon: function (min, max) {
        return Math.random() * (max - min) + min;
    },

    _setTimeOut: function (miliseconds) {
	    var currentTime = new Date().getTime();
	    while (currentTime + miliseconds >= new Date().getTime()) {
	    }
	},

    _stringToAray: function (string) {
        var vec = [], str = '',
			graphLength = string.length;
		for (var i = 0; i < graphLength; i++) {
			while (string[i] !== ' ') {
				str += string[i];
				if (typeof string[i+1] == 'undefined') break;
				i++;
			}
			if (str !== '') vec.push(str); 
            str = '';
            console.log(str);
        }
        return vec;
    },
    _arrayNotDuplicate: function (array, value, length) {
        if (length === 0) return true;
        for (var i = 1; i < length; i++) {
            if (array[i-1] === value) 
                return false;
            
        }
        return true;
    },
	_getNodesAdjacents: function (array, node, startPos) {
		var nodes = [];
		if (startPos === array.length)
			return nodes;
		for (var i = startPos; i < array.length; i++) {
			if (array[i] === node)
				nodes.push(array[i+1]);
			
		}
		return nodes;
	},
    _checkReqQuery: function(req) {
        if (req.query.length === 0) {
            throw new Error('Empty property asked');
        }
		if (typeof req.query.min === 'undefined') {
            throw new Error('Please, define min value');
        }
        if (typeof req.query.max === 'undefined') {
            throw new Error('Please, define max value');
        }
        return true;
    },
	_nodesResponse: function (graphs) {
		var systemResponse = [];
		for (var i = 0; i < graphs.length; i++) {
			for (var j = 0; j < graphs[i].length; j++){
				for (var k = 0; k < graphs[i][j].length; k++) {
					systemResponse.push(graphs[i][j][k].data);
				}
			}
		}
		return systemResponse;
	},
	_relationshipResponse: function (graphs) {
		var systemResponse = [];
		for (var i = 0; i < graphs.length; i++) {
			for (var j = 0; j < graphs[i].length; j++){
				for (var k = 0; k < graphs[i][j].length; k++) {
					for (var l = 0; l < graphs[i][j][k].length; l++) {
						systemResponse.push(graphs[i][j][k][l].data);
						//console.log(graphs[i][j][k][l].data.node+" e "+graphs[i][j][k][l].data.key)
					}
				}
				if (typeof graphs[i][j].data != 'undefined') {
					systemResponse.push(graphs[i][j].data);
					//console.log(graphs[i][j].data.node+" e "+graphs[i][j].data.key)
				}
			}
		}
		return systemResponse;
	},
	_getFormat: function (fileName) {
		var i = fileName.length-1, format = '', str = '';
		while (fileName[i] !== '.') {
			str += fileName[i];
			i--;
		}
		for (var j = str.length-1; j >= 0; j--) {
			format += str[j];
		}
		return format;
	},
	_removeEmptyString: function (array) {
 		var newArray = [];
 		for (var i = 0; i < array.length; i++) {
 			if (array[i]) newArray.push(array[i]);
 		}
 		return newArray;
 	},
 	_checkLabels: function (node, vertices) {
 		var aux = true, result;
 		for (var j = 0; j < vertices.length; j++) {
 			if (!isNaN(vertices[j])) 
 				vertices[j].toString(); 
 			if (node == vertices[j]) {
 				aux = false;
 				break;
 			}
 		}
 		result = aux ? 'undefined' : j;
 		return result;
 	},
 	_setLabelsVertices: function (req, vertices) {
 		var index, labels = [], aux;
 		console.log(req+' '+vertices);
 		for (var i = 0; i < req.length; i++) {
 			aux = '';
 			while (req[i] !== ':') {
 				console.log('req[i]: '+req[i]);
 				aux += aux+req[i];
 				i++;
 			} 
 			i++;
 			console.log('aux: '+aux);
 			index = utils._checkLabels(aux, vertices);
 			console.log('index::::'+index);
 			if (index == 'undefined') 
 				throw new Error('You are trying to define a label to a nonexistent node!');
 			labels[index] = '';
 			while (req[i] !== ',') {
 				labels[index] += req[i];
 				//console.log('labels[index]'+labels[index]);
 				if (i >= req.length-1) 
 					break;
 				i++;
 			}
 			console.log("LABEL:::"+index+" "+vertices[index]+":"+labels[index]+'\n');
		}
		return labels;
 	},
 	_vertELtoHorizontal: function (string) {
		var newString = "";
		for (var i = 0; i < (string.length-1); i++) {
			for (var j = 0; j < string[i].length; j++) {
				newString = newString + string[i][j];
			}
			newString = newString + "  ";
		}
		return newString;
	},
	_openFile: function (file) {
 		return q
	        .nfcall(fs.readFile, file, 'utf-8')
	        .catch( function (err) {
				console.log(err);
				return err;
			});
	},
}
var nodesProps = require('./nodes_prop.js'),
	fs = require('fs'),
	promise = require('bluebird'),
	comp = require('./compare_graphs.js'),
	utils = require('./utils/utility.js');

var downloads = module.exports = {

	_isRepeatableNode: function (node, nodes) {
		if (nodes.length == 0 )
			return false;
		for (var i = 0; i < nodes.length; i++) {
			if (node == nodes[i]) {
				return true;
			}
		}
		return false;
	},

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

	convertToEL: function (object, toComp, start) {
		var string = "", key = "", node = "", nodes = [], allNodes = [], repeatableNodes = []
			number = 0;
		start = start || 0;
		//console.log("start>>> "+ start);
		//console.log("object.length>>> "+ object.length);
		for (var i = start; i < object.length;) {
			key = object[i].key;
			//console.log("key>>> "+ key);
			//console.log("concluido "+i+" de "+object.length);
			number++;

			while (key == object[i].key) {
				//console.log(object[i].node);
				if (i%2 == 0)
					node += object[i].node+" ";
				else 
					node += object[i].node+"  ";
				if (toComp) {
					allNodes.push(object[i].node);
					if (this._isRepeatableNode(object[i].node, nodes))
						repeatableNodes.push(object[i].node);
					else
						nodes.push(object[i].node);
				}
				i++;

				if (!toComp && (i > (object.length-1))) {
					string += node+"\n";
					return {
						'graphs': string,
						'count': number
					};
				}
				else if ((object[i].node == "virtual") && toComp) {
					start = i;
					//console.log("Comparar: "+nodes);
					return comp
						.createCSV(object[i], nodes, allNodes, repeatableNodes, node)
						.then(function () {
							if (i >= object.length)
								return 0;
							else {
								if (object.length%1000 == 0) {
									console.log("time out");
									utils._setTimeOut(10000);
								} 
								var percent = (start/object.length)*100;
								console.log("Criando... "+percent+"% ("+start+"/"+object.length+")"); 
								return downloads.convertToEL(object, toComp, start+1);
							}

						})
						.catch(function (err) {
							return new promise( function (resolve, reject) {
								console.log(err);
								reject(err);
							});
						});
		            i++;
					break;
				}
				
			}
			string += node+"\n";
			node = "";
			nodes = [];
			allNodes = [];
			repeatableNodes = [];
		}
		
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
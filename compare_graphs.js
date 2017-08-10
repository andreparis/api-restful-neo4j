var fs = require('fs'),
	setupPaths = require('./setup.js'),
	mathematicaPath = setupPaths.getMatheticaCompPath(),
	scripts = require('./scripts.js'),
	promise = require('bluebird'),
	utils = require('./utils/utility.js'),
	posFileNamePath = setupPaths.getOS() ? '' : '"',
	fileOriginGraphs = 'comp/no_nodes_removed.csv',
	fileNodeRemoved = 'comp/node_removed.csv',
	filePairNodesRemoved = 'comp/pair_of_nodes_removed.csv',
	TIME_WRITE_FILE = 5000;

var compare = module.exports = {
	
createCSV: function (graph, nodes, allNodes, repeatableNodes, elNodes) {
		var header = 'Property Value, Graph and Removed Node/Pair of Nodes \n';

			compare._writeFileExists(header, "comp/edge_density.csv", graph.edge_density+", graph "+elNodes);
			compare._writeFileExists(header, 'comp/average_distance.csv', graph.average_distance+", graph "+elNodes);
			compare._writeFileExists(header, 'comp/radius.csv', graph.radius+", graph "+elNodes);
			compare._writeFileExists(header, 'comp/diameter.csv', graph.diameter+", graph "+elNodes);
			compare._writeFileExists(header, "comp/wiener_index.csv", graph.wiener_index+", graph "+elNodes);
			compare._writeFileExists(header, "comp/minimum_transmission.csv", graph.minimum_transmission+", graph "+elNodes);
			compare._writeFileExists(header, "comp/maximum_transmission.csv", graph.maximum_transmission+", graph "+elNodes);
			compare._writeFileExists(header, "comp/minimum_degree.csv", graph.minimum_degree+", graph "+elNodes);
			compare._writeFileExists(header, "comp/maximum_degree.csv", graph.maximum_degree+", graph "+elNodes);
			compare._writeFileExists(header, "comp/vertex_connectivity.csv", graph.vertex_connectivity+", graph "+elNodes);
			compare._writeFileExists(header, "comp/edge_connectivity.csv", graph.edge_connectivity+", graph "+elNodes);
			compare._writeFileExists(header, "comp/minimum_vertex_betweenness_centrality.csv", graph.minimum_vertex_betweenness_centrality+", graph "+elNodes);
			compare._writeFileExists(header, "comp/maximum_vertex_betweenness_centrality.csv", graph.maximum_vertex_betweenness_centrality+", graph "+elNodes);
			compare._writeFileExists(header, "comp/minimum_edge_betweenness_centrality.csv", graph.minimum_edge_betweenness_centrality+", graph "+elNodes);
			compare._writeFileExists(header, "comp/maximum_edge_betweenness_centrality.csv", graph.maximum_edge_betweenness_centrality+", graph "+elNodes);
			compare._writeFileExists(header, "comp/minimum_closeness_centrality.csv", graph.minimum_closeness_centrality+", graph "+elNodes);
			compare._writeFileExists(header, "comp/maximum_closeness_centrality.csv", graph.maximum_closeness_centrality+", graph "+elNodes);
		
		return this._newProps("", nodes, allNodes, repeatableNodes, elNodes)
			.then(function (res) {
				//csv += res;
				//console.log("terminou");
				/*fs.writeFile('comp/key_'+graph.key+'.csv', csv, 'utf8', function (err) {
		            if (err) return console.log(err);
		        });*/
			return res;
			})
			.catch(function (err) {
			return new promise( function (resolve, reject) {
				reject(err);
			});
		});
	},
	
	_newProps: function (csv, nodes, allNodes, repeatableNodes, originalGraph, interation) {
		var elNodes = "",
			fileName = 'graphs.el',
			removedNode = "";
		if (typeof interation == 'undefined') {
			var res = this._removeNode(nodes, allNodes, repeatableNodes),
				range = res.range,
				nodesToMath = res.nodes;
			removedNode = res.removedNode;
			nodes = res.newNodes;
			elNodes = this._createELGraph(nodesToMath);
			if (nodes.length == 0)
				interation = 0;
		}
		else {
			var res = this._removePairNode(allNodes, interation);
			elNodes = res.nodes;
			removedNode = res.removedNode;
			interation += 2;
			//console.log("elNodes "+elNodes);
		}
        fs.writeFile('comp/'+fileName, elNodes, 'utf8', function (err) {
            if (err) return console.log(err);
        });
        //console.log(mathematicaPath+fileName+' '+range);
		return scripts.execute(mathematicaPath+fileName+' '+range)
			.then(function (results) {
				//console.log(results);
				var stringResults = results.stdout.replace(/(\r\n|\n|\r)/gm,""),
					mathematicaNodesProps = scripts.mathematicaGraphProperties(stringResults),
					graph = mathematicaNodesProps.props[0];
				var header = "";
				compare._writeFileExists(header, "comp/edge_density.csv", graph.edge_density+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, 'comp/average_distance.csv', graph.average_distance+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, 'comp/radius.csv', graph.radius+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, 'comp/diameter.csv', graph.diameter+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/wiener_index.csv", graph.wiener_index+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/minimum_transmission.csv", graph.minimum_transmission+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/maximum_transmission.csv", graph.maximum_transmission+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/minimum_degree.csv", graph.minimum_degree+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/maximum_degree.csv", graph.maximum_degree+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/vertex_connectivity.csv", graph.vertex_connectivity+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/edge_connectivity.csv", graph.edge_connectivity+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/minimum_vertex_betweenness_centrality.csv", graph.minimum_vertex_betweenness_centrality+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/maximum_vertex_betweenness_centrality.csv", graph.maximum_vertex_betweenness_centrality+",graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/minimum_edge_betweenness_centrality.csv", graph.minimum_edge_betweenness_centrality+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/maximum_edge_betweenness_centrality.csv", graph.maximum_edge_betweenness_centrality+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/minimum_closeness_centrality.csv", graph.minimum_closeness_centrality+", graph "+originalGraph+" less "+removedNode);
				compare._writeFileExists(header, "comp/maximum_closeness_centrality.csv", graph.maximum_closeness_centrality+", graph "+originalGraph+" less "+removedNode);
				if (nodes.length > 0) {
					return compare._newProps("", nodes, allNodes, repeatableNodes, originalGraph);
				}
	        	else if (interation < allNodes.length) {
	        		//console.log("interation "+interation);
	        		return compare._newProps("", nodes, allNodes, repeatableNodes, originalGraph, interation);
	        	}	
	        	else
	        		return "success";
			})
			.catch(function (err) {
				return new promise( function (resolve, reject) {
					reject(err);
				});
			});
	},

	_writeFIle: function (fileName, string) {
		fs.writeFile(fileName, string, 'utf8', function (err) {
            if (err) return console.log(err);
            console.log("Escreveu: "+string);
            return string;
        });
	},

	_writeFileExists: function (header, fileName, string) {
		fs.exists(fileName, function(exists) { 
			if (exists) {
				//console.log("EXISTE "+fileName);
				/*fs.appendFile(fileName, string+'\n', function (err) {
					if (err) {
					    return console.log(err);
					  }
				});*/
				fs.readFile(fileName, 'utf8', function (err,data) {
				  if (err) {
				    return console.log(err);
				  }
				  fs.writeFile(fileName, data+"\n"+string, 'utf8', function (err) {
			            if (err) return console.log(err);
			            //console.log("Escreveu: "+data+string);
			            return data+"\n"+string+'\n';
			        });
				});
			} 
			else {
				//console.log("NAO EXISTE "+fileName);
				fs.writeFile(fileName, header+string, 'utf8', function (err) {
		            if (err) return console.log(err);
		            //console.log("Escreveu: "+string);
		            return string;
		        });
			}
		});
	},

	_removeNode: function (nodes, allNodes, repeatableNodes, str) {
		var newArrayOfNodes = [], 
			node = nodes[0],
			newAllNodes = [],
			connectedNode = "",
			count = 0,
			strNodes = "";
		if (nodes.length == 0)
			return 0;
		for (var i = 0; i < nodes.length; i++) {
			newArrayOfNodes[i-1] = nodes[i];
		}
		for (var j = 0; j < allNodes.length; j++) {
			if (allNodes[j] == node) {
				if (j%2 == 0) {
					connectedNode = allNodes[j+1];
					j++;
				}
				else {
					connectedNode = allNodes[j-1];
				}
				//console.log("connectedNode "+connectedNode);
				if (!this._isRepeatableNode(connectedNode, repeatableNodes))
					count++;
			}
			else {
				if (j%2 == 0) {
					if (allNodes[j+1] != node) 
						newAllNodes.push(allNodes[j]);
				}
				else 
					newAllNodes.push(allNodes[j]);
			}
		}
		if (count > 0) 
			count += (newAllNodes.length/2);

		return {
			'nodes': newAllNodes,
			'range': count,
			'newNodes': newArrayOfNodes,
			'removedNode': node
		};
	},

	_removePairNode: function(allNodes, interation) {
		var str = "", removedNode = "";
		//console.log("Erro??"+ allNodes);
		for (var i = 0; i < allNodes.length; i++) {
			if (i == interation) {
				removedNode = allNodes[i] +" "+allNodes[i+1];
				i += 2;
				//console.log("i2: "+i);
				if (typeof allNodes[i] == 'undefined')
					break;
			}
			if (i%2 == 0) 
				str+= allNodes[i]+" ";
			else 
				str+= allNodes[i]+"  ";
		}
		//console.log("str "+str);
		//console.log("removedNode "+removedNode);
		return {
			'nodes': str,
			'removedNode': removedNode
		};
	},

	_isRepeatableNode: function (node, nodes) {
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i] == node)
				return true; 
		}
		return false;
	},
	_createELGraph: function (arrayNodes) {
		var str = "";
		for (var i = 0; i < arrayNodes.length; i++) {
			if (i%2 == 0) 
				str += arrayNodes[i]+" ";
			else
				str += arrayNodes[i]+"  ";
		}
		return str;
	}
}
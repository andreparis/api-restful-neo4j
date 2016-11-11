var fs = require('fs'),
	setupPaths = require('./setup.js'),
	mathematicaPath = setupPaths.getMatheticaCompPath(),
	scripts = require('./scripts.js'),
	promise = require('bluebird'),
	posFileNamePath = setupPaths.getOS() ? '' : '"';

var compare = module.exports = {
	
	createCSV: function (graph, nodes, allNodes, repeatableNodes) {
		var header = 'node,number_of_vertices,number_of_edges,'+
			'edge_density,average_distance,radius,diameter,wiener_index,'+
			'minimum_transmission,maximum_transmission,minimum_degree,maximum_degree,'+
			'vertex_connectivity,edge_connectivity,minimum_vertex_betweenness_centrality,'+
			'maximum_vertex_betweenness_centrality,minimum_edge_betweenness_centrality,'+
			'maximum_edge_betweenness_centrality,minimum_closeness_centrality,maximum_closeness_centrality,'+
			'removed_node \n',
			props = graph.node+","+graph.number_of_vertices+","+graph.number_of_edges+","+
					graph.edge_density+","+graph.average_distance+","+graph.radius+","+
					graph.diameter+","+graph.wiener_index+","+graph.minimum_transmission+","+
					graph.maximum_transmission+","+graph.minimum_degree+","+
					graph.maximum_degree+","+graph.vertex_connectivity+","+graph.edge_connectivity+","+
					graph.minimum_vertex_betweenness_centrality+","+
					graph.maximum_vertex_betweenness_centrality+","+
					graph.minimum_edge_betweenness_centrality+","+
					graph.maximum_edge_betweenness_centrality+","+
					graph.minimum_closeness_centrality+","+graph.maximum_closeness_centrality+
					", no node removed\n",
			csv = nodes+"\n"+header+props;
		return this._newProps("", nodes, allNodes, repeatableNodes)
			.then(function (res) {
				csv += res;
				//console.log("terminou");
				fs.writeFile('comp/key_'+graph.key+'.csv', csv, 'utf8', function (err) {
		            if (err) return console.log(err);
		        });
			})
			.catch(function (err) {
			return new promise( function (resolve, reject) {
				reject(err);
			});
		});
	},
	
	_newProps: function (csv, nodes, allNodes, repeatableNodes, interation) {
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
			console.log("elNodes "+elNodes);
		}
        fs.writeFile('comp/'+fileName, elNodes, 'utf8', function (err) {
            if (err) return console.log(err);
        });
		return scripts.execute(mathematicaPath+fileName+'" '+range+posFileNamePath)
			.then(function (results) {
				var stringResults = results.stdout.replace(/(\r\n|\n|\r)/gm,""),
					mathematicaNodesProps = scripts.mathematicaGraphProperties(stringResults),
					graph = mathematicaNodesProps.props[0];
				//console.log(results);
				//console.log('mathematicaNodesProps: '+JSON.stringify(mathematicaNodesProps));
				csv += "virtual,"+graph.number_of_vertices+","+graph.number_of_edges+","+
					graph.edge_density+","+graph.average_distance+","+graph.radius+","+
					graph.diameter+","+graph.Wiener_index+","+graph.minimum_transmission+","+
					graph.maximum_transmission+","+graph.minimum_degree+","+
					graph.maximum_degree+","+graph.vertex_connectivity+","+graph.edge_connectivity+","+
					graph.minimum_vertex_betweenness_centrality+","+
					graph.maximum_vertex_betweenness_centrality+","+
					graph.minimum_edge_betweenness_centrality+","+
					graph.maximum_edge_betweenness_centrality+","+
					graph.minimum_closeness_centrality+","+graph.maximum_closeness_centrality+","+
					removedNode+"\n";
				if (nodes.length > 0) {
					return compare._newProps(csv, nodes, allNodes, repeatableNodes);
				}
	        	else if (interation < allNodes.length) {
	        		console.log("interation "+interation);
	        		return compare._newProps(csv, nodes, allNodes, repeatableNodes, interation);
	        	}	
	        	else
	        		return csv;
			})
			.catch(function (err) {
				return new promise( function (resolve, reject) {
					reject(err);
				});
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
		//console.log("newArrayOfNodes "+newArrayOfNodes);
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
		console.log( allNodes.length);
		for (var i = 0; i < allNodes.length; i++) {
			if (i == interation) {
				removedNode = allNodes[i] +" "+allNodes[i+1];
				i += 2;
				console.log("i2: "+i);
				if (typeof allNodes[i] == 'undefined')
					break;
			}
			if (i%2 == 0) 
				str+= allNodes[i]+" ";
			else 
				str+= allNodes[i]+"  ";
		}
		console.log("str "+str);
		console.log("removedNode "+removedNode);
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
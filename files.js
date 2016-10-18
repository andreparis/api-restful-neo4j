var fs = require('fs'),
    q = require('q'),
    promise = require('bluebird'),
	cypher = require('./connect neo4j server.js'),
    utils = require('./utils/utility.js'),
	scripts = require('./scripts.js'),
	setProps = require('./nodes_prop.js'),
	crypto = require('crypto'),
	setupPaths = require('./setup.js'),
	filePath = setupPaths.getUploadedFilePath(),
	mathematicaPath = setupPaths.getMathematicaPath(),
	showg = setupPaths.getShowgPath(),
	posFileNamePath = setupPaths.getOS() ? '' : '"';
			
	
var file = module.exports = {
	convertToBDRestPattern: function (fileName, format, labels) {
		var fileNameAndPath = filePath+fileName;
		if (format == 'el') {
			return utils
				._openFile(fileNameAndPath)
				.then( function (result) {
					console.log("entrou aqui!! "+result);
					return file
						.convertELST(result, fileName, labels, 'el')
						.catch( function (err) {
				        	return new promise( function (resolve, reject) {
								reject('Error to convert!'+ err);
							});
				        });
				})
		        .catch( function (err) {
		        	return new promise( function (resolve, reject) {
						reject('Cannot open file!'+ err);
					});
		        });
		}
		else if (format == 'g6') {
			var fileN = setupPaths.getUploadedFilePath();
			console.log(fileN);
			return scripts
				.execute(showg+' -e '+fileN+fileName+posFileNamePath)
				.then( function (graph) {
					return file.convertG6toEL(graph.stdout, fileName);
				})
				.then( function (params) {
					//console.log(params);
					return file
						.convertELST(params.content, params.file_name, labels, format)
						.catch( function (err) {
				        	return new promise( function (resolve, reject) {
								reject('Error to convert!'+ err);
							});
				        });
				})
				.catch(function (err) {
					return new promise( function (resolve, reject) {
						reject('Cannot open file!'+ err);
					});
				});
		}
		else if (format == 'tgf') {
			return utils
				._openFile(fileNameAndPath)
				.then( function (result) {
					console.log(result);
					return file
						.convertTGFtoEL(result, fileName);
				})
				.then( function (result) {
					console.log(result);
					if (result.labels.length !== 0)
						labels = result.labels;
					return file
						.convertELST(result.content, result.file_name, 
									labels, 'tgf')
						.catch( function (err) {
				        	return new promise( function (resolve, reject) {
								reject('Error to convert!'+ err);
							});
				        });
				})
		        .catch( function (err) {
		        	return new promise( function (resolve, reject) {
						reject('Cannot open file!'+ err);
					});
		        });
		}
		else if (format == 'lgf') {
			return utils
				._openFile(fileNameAndPath)
				.then( function (result) {
					console.log(result);
					return file
						.converLGFtoEL(result, fileName);
				})
				.then( function (result) {
					return file
						.convertELST(result.content, result.file_name,
							labels, 'lgf', result.labels, result.peso)
						.catch( function (err) {
							return new promise( function (resolve, reject) {
								reject('Error to convert!'+ err);
							});
						});
				})
				.catch( function (err) {
					return new promise( function (resolve, reject) {
						reject('Cannot open file!'+ err);
					});
				});
		}
		else if (format == 'gagx3') {
			return utils
				._openFile(fileNameAndPath)
				.then( function (result) {
					console.log(result);
					return file
						.converGAGX3toEL(result, fileName);
				})
				.then( function (result) {
					console.log(result.content + '\nname: '+  result.file_name);
					return file
						.convertELST(result.content, result.file_name, labels, 'gagx3')
						.catch( function (err) {
							return new promise( function (resolve, reject) {
								reject('Error to convert! '+ err);
							});
						});
				})
				.catch(function (err) {
					return new promise( function (resolve, reject) {
						reject('Cannot open file!' + err);
					});
				});
		}
		else
			return new promise( function (_, reject) {
				 setTimeout(reject('invalid format!'), 1000);
			});
 	},

 	_sendToNeo4j: function (fileName, graphs, start, graphLength, labels, labels_edge, edge_weight) {
 		var CONST_MAX_INSERTION = 25000;
 		console.log(mathematicaPath+fileName+' '+start+' '+CONST_MAX_INSERTION+posFileNamePath);
 		return scripts.execute(mathematicaPath+fileName+' '+start+' '+CONST_MAX_INSERTION+posFileNamePath)
			.then(function (results) {
				console.log("Mathematica executado com sucesso!");
				var stringResults = results.stdout.replace(/(\r\n|\n|\r)/gm,""),
			        mathematicaNodesProps = scripts.mathematicaGraphProperties(stringResults),
			        index, bc, vertices, arrayToString, edge_prop = [],	graph, nodes,  vec = [], 
			        edgeInd = 0, key, count, countReq = 0,
			        param = {
			           'statements': []
			        };
			    //console.log('mathematicaNodesProps: '+JSON.stringify(mathematicaNodesProps));
				if (results.stdout[0] == '\r') {
			    	return new promise( function (resolve, reject) {
						reject(results.stdout);
					});
			    }
			    //console.log("mathematicaNodesProps:"+ JSON.stringify(mathematicaNodesProps));
				for (var i = 0; i < CONST_MAX_INSERTION; i++) {
					start++;
					graph = mathematicaNodesProps.props[i].graph;
					nodes = {
						'parameters': {
							'props': []
						}
					};
					//console.log("graphs[i]:"+graphs[i])
					//console.log(graphs[i]);
					vec = utils._stringToAray(graphs[graph-1]);
					//console.log('vec: '+vec);
					arrayToString = vec.toString().replace (/,/g, "");
						//console.log(arrayToString);
					key = crypto.createHmac("md5", "password")
								.update(arrayToString).digest('hex');
					count = 0;
					//console.log('+mathematicaNodesProps.props['+i+']'+mathematicaNodesProps.props[i]);
					//console.log("mathematicaNodesProps.props["+i+"].graph "+mathematicaNodesProps.props[i].graph);
					//console.log("mathematicaNodesProps.props["+i+"].vertices "+mathematicaNodesProps.props[i].vertices);
					vertices = mathematicaNodesProps.props[i].vertices;
					for (var j = 0; j < vertices.length; j++) {
						if (typeof labels[j] == 'undefined') 
							labels[j] = 'null';
						nodes.parameters.props.push(setProps.nodeLeaf(mathematicaNodesProps.props[i], j, 
																		key, labels[j]));
					}
					//console.log(nodes.parameters);
					nodes.parameters.props.push(setProps.nodeRoot(mathematicaNodesProps.props[i], key));
					param.statements.push({
						'statement': 'OPTIONAL MATCH p=(n) WHERE n.graph='+graph+
									' AND n.key="'+key+'"'+
									' FOREACH (u in'+
									' CASE WHEN'+
									' nodes(p) IS NULL'+
									' THEN [n]'+
									' ELSE [] END |'+
									' CREATE (n {props}) )',
						'parameters': nodes.parameters
					});
					var edgeBetCent = 0;
					if (typeof labels_edge !== 'undefined') {
						for (var a = 0; a < labels_edge.length; a++)
							edge_prop[a] = ', edge_label: "'+labels_edge[a]+
									'", peso:"'+edge_weight[a]+'"';
					}
					else if (typeof edge_weight !== 'undefined') {
						for (var a = 0; a < edge_weight.length; a++)
							edge_prop[a] = ', peso:"'+edge_weight[a]+'"';
					}
					else {
						var len = vec.length;
						for (var a = 0; a < len; a++)
							edge_prop[a] = '';
					}
					//console.log(edge_prop);
					edgeInd = 0;
					for (var k = 0; k < (vec.length-1); k++) {
						//console.log(vec[k]+" "+vec[k+1]);
						//console.log(edge_prop[edgeInd]);
						bc = mathematicaNodesProps
							.props[i]
							.edge_betweenness_centrality[edgeBetCent];
						param.statements.push({
							'statement': 'MATCH (n), (m)'+
										' WHERE n.graph='+graph+' AND n.node="'+vec[k]+'"'+
										' AND m.graph='+graph+' AND m.node="'+vec[k+1]+'"'+
										' AND n.key="'+key+'" AND m.key="'+key+'"'+
										' OPTIONAL MATCH p=(n)-[r]->(m)'+
										' WHERE r.betweenness_centrality="'+bc+'"'+
										' WITH n, m, nodes(p) as relations'+
										' FOREACH (u in'+
										' CASE WHEN'+
										' relations IS NULL'+
										' THEN [1]'+
										' ELSE [] END |'+
										' CREATE (n)-[:has {betweenness_centrality:"'+
										+bc+'"'+edge_prop[edgeInd]+'}]->(m))'
						});
						edgeBetCent++;
						k++;
						edgeInd++;
					}
					//console.log(JSON.stringify(param.statements)+" AQUI\n\n\n");
					//console.log('\nAQUI:  '+JSON.stringify(mathematicaNodesProps.props[i].edge_betweenness_centrality));
					vec = [];
					if (start >= graphLength) break;
				}
				//console.log(param);
				//console.log("param.length "+param.length);
				//console.log('parou em:'+start);
				if (param.length == 0) {
					return new promise( function (resolve, reject) {
						reject('Empty file or error during create REST objects!');
					});
				}
				var sParam = JSON.stringify(param);
				return cypher
					.statements(sParam)
					.then(function (results) {
						console.log("results "+results);
						if (start >= graphLength) return results;
						console.log("chamou recursão!");
						utils._setTimeOut(500);
						return file._sendToNeo4j(fileName, graphs, start, graphLength, labels, labels_edge, edge_weight);
					})
					.catch(function (err) {
						return new promise( function (resolve, reject) {
							reject(err);
						});
					});
		}) 
		.catch( function (err) {
			return new promise( function (resolve, reject) {
				reject('Error in ELST Function is '+ err);
			});
		});

 	},

 	convertELST: function (content, fileName, labels, format, labels_edge, edge_weight) {
		var graphs = content.split(/ +\r\n|\n|\r/),
			graphLength;
	    console.log("format is: "+format);
	    if (format == 'g6') graphs = utils._removeEmptyString(graphs);
	    if (typeof labels !== 'undefined') 
	    	labels = utils._setLabelsVertices(labels, vertices);
	    else
	    	labels = [];
	    if (graphs[0].length <= 3) {
			var newgraphs = utils._vertELtoHorizontal(graphs);
			graphs = [];
			graphs[0] = newgraphs;
			fs.writeFile(filePath+fileName, graphs[0], 'utf8', function (err) {
				if (err) return console.log(err);
			});
			graphLength = graphs.length;

		}
		else if (format == 'el') {
			graphLength = graphs.length-1;
		} 
		else 
			graphLength = graphs.length;
		//console.log(graphs);
		console.log('Executará o mathematica\nNúmero de grafos: '+graphLength);
		labels = [];
		return file
	    	._sendToNeo4j(fileName, graphs, 0, graphLength, labels, labels_edge, edge_weight)
	    	.then( function (result) {
	    		return result;
	    	})
	    	.catch( function (err) {
	    		return err;
	    	});
    },
    convertG6toEL: function (results, fileName) {
		var contents = {}, name;
		//console.log("CONVERTEU?>>>>> "+results);
		name = crypto.createHmac("md5", "password")
				.update(Date.now().toString+fileName).digest('hex')+'.el';
		fs.writeFile(filePath+name, results.split(/ +\r/), 'utf8', function (err) {
			if (err) return console.log(err);
		});
		contents = {'file_name': name, 'content': results};
		return contents;
	},
	convertTGFtoEL: function (content, fileName) {
		var string = "", hasLabels = false, params,
			labels = "", start = true, j = 0, name;
		if (content[2] !== '\n') hasLabels = true;
		while (content[j] !== '#') {
			if (hasLabels) {
				while (content[j] !== ' ') {
					labels += content[j];
					j++;	
				} 
				labels +=':';
				j++;
				while (content[j] !== '\n') {
					labels += content[j];
					j++;	
				}
				j++; 
				if (content[j] !== '#' ) 
					labels += ',';
			}
			else 
				j++;
		}
		j++;
		for (var i = j; i < content.length; i++) {
			if (content[i] !== ' ' && content[i] !== '\n' && content[i] !== '#') {
				string = string+content[i]+' '+content[i+2];
				string+='  ';
				i+=2;
			}
			if (typeof content[i] == 'undefined') break;
		}
		name = crypto.createHmac("md5", "password")
					.update(Date.now().toString+fileName).digest('hex')+'.el';
		fs.writeFile(filePath+name, string, 'utf8', function (err) {
			if (err) return console.log(err);
		});
		params = {
			'content': string,
			'labels': labels,
			'file_name': name
		};
		return params;
	},
	converLGFtoEL: function (content, fileName) {
		var string = '', init = true, label = [], 
			peso = [], name, result, aux1 = 0, aux2 = 0,
			str1 = '', str2 = '';
		for (var i = 0; i < content.length; i++) {
			if (init) {
				while (content[i] !== '\n') i++;
				i++;
				while (content[i] !== '\n') i++; 
				while (content[i] !== '@') i++;
				while (content[i] !== '\n') i++;
				i++;
				while (content[i] !== '\n') i++;
				i++;
				init = false;
			}
			console.log('\n\nout: '+content[i]);
			while (content[i] != '\n') {
				if (content[i-1] == '\n') {
					while (content[i] !== '\t') {
						str1 = str1+content[i];
						i++;
					}
					i++;
					while (content[i] !== '\t') {
						str2 += content[i];
						console.log(str2);
						i++;
					} 
					string = string+str1+' '+str2+'  ';
					console.log('\n'+string);
					str1 = '';
					str2 = '';
					i++;
				}
				else {
					//console.log(content+'\n\n'+content[i]);
					while (content[i] !== '\n') {
						str1 += content[i];
						i++;
						if (content[i] == '\t') break;
					}
					if (content[i] == '\n') {
						peso[aux2] = str1;
						aux2++;
						str1 = '';
					}
					else {
						i++;
						while (content[i] !== '\n') {
							str2 += content[i];
							console.log(JSON.stringify(content[i]));
							if (content[i+1] == 'undefined') break; 
							i++;
						}
						peso[aux2] = str2;
						label[aux1] = str1;
						aux2++;
						aux1++;
						str1 = '';
						str2 = '';
					}
				} 
			}
		}
		name = crypto.createHmac("md5", "password")
					.update(Date.now().toString+fileName).digest('hex')+'.el';
		fs.writeFile(filePath+name, string, 'utf8', function (err) {
			if (err) return console.log(err);
		});
		result = {
			'content': string,
			'labels': label,
			'peso': peso,
			'file_name': name
		};
		return result;
	},
	converGAGX3toEL: function (content, fileName) {
		var str = '', i = 0, j = 0, numGraphs = 0, contLine = 0, k = 0, 
			node = 0, jumpStrs = 0, contNodes = 0, result = {}, name = '';
		while (content[i] !== '\n') {
			str += content[i];
			i++;
		}
		console.log(content[i]);
		i++;
		numGraphs = parseInt(str);
		console.log(numGraphs);
		str = '';
		while (k < numGraphs) {
			if (content[i] == '\n') k++;
			i++;
		}
		console.log(content[i]);
		console.log('\npulou para: '+content[i]+'\n');
		for (var j = i; j < content.length; j++) {
			if (content[j] == '0' || content[j] == '1') {
				if (content[j] == '1') {
					str += 	contLine.toString()+' '+contNodes.toString()+'  ';
					console.log(str);
				}
				if (contNodes == numGraphs) {
					contLine++;
					contNodes = 0;
				} 
				else contNodes++;
			}
			console.log(j+' '+content.length+'\n\nFinal:\n'+str);	
		}
		name = crypto.createHmac("md5", "password")
					.update(Date.now().toString+fileName).digest('hex')+'.el';
		fs.writeFile(filePath+name, str, 'utf8', function (err) {
			if (err) return console.log(err);
		});
		result = {
			'content': str,
			'file_name': name 
		};
		return result;
	},
}
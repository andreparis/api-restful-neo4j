var fs = require('fs'),
    q = require('q'),
    promise = require('bluebird'),
    neo4j = require('neo4j-driver').v1,
    cypher = require('./connect neo4j server.js'),
    utils = require('./utils/utility.js'),
	scripts = require('./scripts.js'),
	setProps = require('./nodes_prop.js'),
	crypto = require('crypto'),
	setupPaths = require('./setup.js'),
	filePath = setupPaths.getUploadedFilePath(),
	mathematicaPath = setupPaths.getMathematicaPath(),
	juliaPath = setupPaths.getJuliaPath(),
	showg = setupPaths.getShowgPath(),
	posFileNamePath = setupPaths.getOS() ? '' : '"',
	driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "labtel123")),
    session = driver.session();
			
	
var file = module.exports = {
	convertToBDRestPattern: function (fileName, format, labels) {
		var fileNameAndPath = filePath+fileName;
		if (format == 'el') {
			console.log("File input el");
			return utils
				._openFile(fileNameAndPath)
				.then( function (result) {
					//console.log("entrou aqui!! "+result);
					return file
						.convertELST(result, fileName, labels, format)
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
			console.log("File input g6");
			var fileN = setupPaths.getUploadedFilePath();
			//console.log(showg+' -e '+fileN+fileName+posFileNamePath);
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
			console.log("File input tgf");
			return utils
				._openFile(fileNameAndPath)
				.then( function (result) {
					return file
						.convertTGFtoEL(result, fileName);
				})
				.then( function (result) {
					console.log("TESTE "+result.labels.length);
					//if (result.labels.length !== 0)
					//	labels = result.labels;
					console.log(result.content+result.file_name+labels+format);
					return file
						.convertELST(result.content, result.file_name, labels, format)
						.catch( function (err) {
				        	return new promise( function (resolve, reject) {
								reject('Error to convert!'+ JSON.stringify(err));
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
			console.log("File input lgf");
			return utils
				._openFile(fileNameAndPath)
				.then( function (result) {
					//console.log(result);
					return file
						.converLGFtoEL(result, fileName);
				})
				.then( function (result) {
					return file
						.convertELST(result.content, result.file_name, labels, format, result.labels, result.peso)
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
			console.log("File input gagx3");
			return utils
				._openFile(fileNameAndPath)
				.then( function (result) {
					//console.log(result);
					return file
						.converGAGX3toEL(result, fileName);
				})
				.then( function (result) {
					//console.log(result.content + '\nname: '+  result.file_name);
					return file
						.convertELST(result.content, result.file_name, labels, format)
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

 	_sendToNeo4jDriver: function (mathematicaNodesProps, propsIndex, CONST_MAX_INSERTION, fileName, graphs, start, graphLength, labels, labels_edge, edge_weight, time) {
 		//1. Criar cypher: criar nós, relações e propriedades.
	    var bc, vertices, arrayToString, edge_prop = [], graph, aux = [],
	        vec = [], edgeInd = 0, key, cypher = "", 
	        vertices = mathematicaNodesProps.props[propsIndex].vertices;
	    graph = mathematicaNodesProps.props[propsIndex].graph;
	    vec = utils._stringToArray(graphs[graph-1]);
		arrayToString = vec.toString().replace (/,/g, "");
		key = crypto.createHmac("md5", "password")
					.update(arrayToString).digest('hex');
		count = 0;
		var edgeBetCent = 0;
		if (typeof labels_edge != 'undefined' || typeof edge_weight != 'undefined')
		{
			if (typeof labels_edge != 'undefined' || labels_edge.length > 0) {
				for (var a = 0; a < labels_edge.length; a++)
					edge_prop[a] = ', edge_label: "'+labels_edge[a]+
							'", peso:"'+edge_weight[a]+'"';
			}
			if (typeof edge_weight != 'undefined' || edge_weight.length > 0) {
				for (var b = 0; b < edge_weight.length; b++)
					edge_prop[b] = ', peso:"'+edge_weight[b]+'"';
			}
		}
		else {
			var len = vec.length;
			for (var c = 0; c < len; c++)
				edge_prop[c] = '';
		}
		edgeInd = 0;
		cypher+= 'OPTIONAL MATCH p=(n:Virtual) WHERE n.key="'+key+'"'+
				' FOREACH (u in'+
				' CASE WHEN'+
				' nodes(p) IS NULL'+
				' THEN [1]'+
				' ELSE [] END |'+
				' CREATE (n:Virtual '+setProps.virtualNodeProps(key)+')';
		for (var k = 0; k < (vec.length-1); k++) {
			bc = mathematicaNodesProps
				.props[propsIndex]
				.edge_betweenness_centrality[edgeBetCent];
				edgeBetCent++;
			aux.push(vec[k]);
			aux.push(vec[k+1]);
			var contR = 0;
			var contL = 0;
			for (var i = 0; i < aux.length; i++) {
				if (vec[k] == aux[i])
					contR++;
				if (vec[k+1] == aux[i])
					contL++;
			}
			if ((contR > 1) && (contL > 1)) {
				cypher+= ' CREATE (n'+vec[k]+' )-[:Edge {betweenness_centrality:"'+
					bc+'"'+edge_prop[edgeInd]+'}]->(n'+vec[k+1]+' )';
			}
			else if (contL > 1){
				cypher+= ' CREATE (n'+vec[k]+':Vertice {node:"'+vec[k]+'", key: "'+key+'"})-[:Edge {betweenness_centrality:"'+
					bc+'"'+edge_prop[edgeInd]+'}]->(n'+vec[k+1]+')';
			}
			else if (contR > 1){
				cypher+= ' CREATE (n'+vec[k]+')-[:Edge {betweenness_centrality:"'+
					bc+'"'+edge_prop[edgeInd]+'}]->(n'+vec[k+1]+':Vertice {node:"'+vec[k+1]+'", key: "'+key+'"})';
			}
			else {
				cypher+= ' CREATE (n'+vec[k]+':Vertice {node:"'+vec[k]+'", key: "'+key+'"})-[:Edge {betweenness_centrality:"'+
					bc+'"'+edge_prop[edgeInd]+'}]->(n'+vec[k+1]+':Vertice {node:"'+vec[k+1]+'", key: "'+key+'"})';
			}

			k++;
			edgeInd++;
		}
		cypher+=')';
		return session
			.run(cypher, setProps.nodeVirtualDriver(mathematicaNodesProps.props[propsIndex], key))
			.then( function (results) {
				propsIndex++;
				start++;
				//console.log(start);
				
                if (start%1000 == 0 ) {
                    //time = ((new Date().getTime()/(1000*60))) - time;
                    var time2 = process.hrtime(time);
                    var porcent = (start/graphLength)*100
					console.log("Concluído: "+porcent+"% ("+start+"/"+graphLength+")");
                    console.info("Execution time (hr): %ds %dms", time2[0], time2[1]/1000000);
                    //utils._writeFileExists("tempoUpload.csv",start+","+time2[0]+","+ time2[1]/1000000); 
                    time = process.hrtime();
                    utils._setTimeOut(2000);
                    if (start%200000 == 0) 
                        utils._setTimeOut(120000);
                    //utils._writeFileExists("tempoUpload.csv",start+","+time); 
                    //time = ((new Date().getTime()/(1000*60)));
				}
				if (start >= graphLength) {
                    var time2 = process.hrtime(time);
                    var porcent = (start/graphLength)*100
					console.log("Concluído: "+porcent+"% ("+start+"/"+graphLength+")");
                    console.info("Execution time (hr): %ds %dms", time2[0], time2[1]/1000000);
                    //utils._writeFileExists("tempoUpload.csv",start+","+time2[0]+","+ time2[1]/1000000);
                    session.close();
                    driver.close();
                    return 'Dados inseridos com sucesso!';
				}
				
				else if (propsIndex >= CONST_MAX_INSERTION) {
					//1000(ms to s) 60 (s to min)
					var time2 = process.hrtime(time);
                    var porcent = (start/graphLength)*100
					console.log("Concluído: "+porcent+"% ("+start+"/"+graphLength+")");
                    console.info("Execution time (hr): %ds %dms", time2[0], time2[1]/1000000);
                   // utils._writeFileExists("tempoUpload.csv",start+","+time2[0]+","+ time2[1]/1000000);
					return file._sendToMathematica(fileName, graphs, start, graphLength, labels, labels_edge, edge_weight);
		
				}
				
				
				return file._sendToNeo4jDriver(mathematicaNodesProps, propsIndex, CONST_MAX_INSERTION, fileName, graphs, 
								start, graphLength, labels, labels_edge, edge_weight, time);

			})
			.catch( function (err) {
				return new promise( function (resolve, reject) {
					reject(err);
				});
			});
 	},

	_sendToMathematica: function (fileName, graphs, start, graphLength, labels, labels_edge, edge_weight) {
 		var CONST_MAX_INSERTION = 15000;
 		//No script mathematica.m é existe um break em CONST_MAX, isto é, o for inicia em start, indo até o tamanho
 		//maximo de grafos do arquivo. Porém, caso atinja CONST_MAX ele da o break.
 		//console.log("....Calculando no Julia....");	
		//var time  = ((new Date().getTime()/(1000*60)));
        //var hrstart = process.hrtime();

        var time = process.hrtime();

		//return scripts.execute(juliaPath+fileName+' '+start+' '+CONST_MAX_INSERTION+posFileNamePath)
        console.log("Executando Mathematica...");
		return scripts.execute(mathematicaPath+fileName+' '+start+' '+CONST_MAX_INSERTION+posFileNamePath)	
		.then(function (results) {
			console.log("Mathematica executado com sucesso!");
			var stringResults = results.stdout.replace(/(\r\n|\n|\r)/gm,""),
				mathematicaNodesProps = scripts.mathematicaGraphProperties(stringResults), propsIndex = 0;
			return file
				._sendToNeo4jDriver(mathematicaNodesProps, propsIndex, CONST_MAX_INSERTION, fileName, 
					graphs, start, graphLength, labels, labels_edge, edge_weight, time)
				.then(function (res) {
                    //var hrend = process.hrtime(hrstart);
                    //console.info("Execution time (hr): %ds %dms", hrend[0], hrend[1]/1000000);
                    utils._writeFileExists("tempoUpload.csv",start+","+hrend[0]+","+ hrend[1]/1000000); 
					return res;
				})
				.catch(function (err) {
					Console.log("CHAMOU ERRO2");
					return new promise( function (resolve, reject) {
						reject('Error in ELST Function is '+ err);
					});
				});
		}) 
		.catch(function (err) {
			Console.log("CHAMOU ERRO");
			return new promise( function (resolve, reject) {
				reject('Error in ELST Function is '+ err);
			});
		});

 	},


		convertELST: function (content, fileName, labels, format, labels_edge, edge_weight) {
 		var graphs = content.split(/ +\r\n|\n|\r/),
			graphLength;
		if (format == 'g6') graphs = utils._removeEmptyString(graphs);
	    if (typeof labels !== 'undefined') 
	    {
	    	var vec = utils._getUnrepeatableVertices(utils._stringToArray(graphs[0]));
	    	console.log("vec "+vec);
	    	labels = utils._setLabelsVertices(labels, vec);
	    	console.log("labels "+labels);
	    }
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
		//console.log('Executará o mathematica\nNúmero de grafos: '+graphLength);
		labels = [];
		return file
	    	._sendToMathematica(fileName, graphs, 0, graphLength, labels, labels_edge, edge_weight)
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
			while (content[i] != '\n') {
				if (content[i-1] == '\n') {
					while (content[i] !== '\t') {
						str1 = str1+content[i];
						i++;
					}
					i++;
					while (content[i] !== '\t') {
						str2 += content[i];
						i++;
					} 
					string = string+str1+' '+str2+'  ';
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
		i++;
		numGraphs = parseInt(str);
		str = '';
		while (k < numGraphs) {
			if (content[i] == '\n') k++;
			i++;
		}
		for (var j = i; j < content.length; j++) {
			if (content[j] == '0' || content[j] == '1') {
				if (content[j] == '1') {
					str += 	contLine.toString()+' '+contNodes.toString()+'  ';
				}
				if (contNodes == numGraphs) {
					contLine++;
					contNodes = 0;
				} 
				else contNodes++;
			}
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

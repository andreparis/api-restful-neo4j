var server = require('./server.js'),
    cypher = require('./connect neo4j server.js'),
    files = require('./files.js'),
    express = require('express'),
    utility = require('./utils/utility.js');
    multer = require('multer'),
    translate = require('./translate.js'),
    filter = require('./nodes_prop.js'),
    crypto = require('crypto'),
    setup = require('./setup.js'),
    app = express(),
	nameData = Date.now(),
    storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, setup.getUploadedFilePath())
            },
            filename: function (req, file, cb) {
                console.log("Multer");
                cb(null, nameData+file.originalname)
            }
        }),
    upload = multer({ storage: storage }),
    q = require('q'),
    fs = require('fs'),
    downloads = 'downloads/';
/*DEFINE RESPONSE STATUS*/
var LOAD_SUCCESS = '201', LOAD_ERROR = '501',
    GET_SUCCESS = '202',  GET_ERROR = '502',
    DELETE_SUCCESS = '203', DELETE_ERROR = '503';
app = server._init();
/* SERVER SECURITY */
app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.get('/neo4j_inf', function (req, res) {
    return cypher
        .neo4jServerInformations()
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {
            res.json(error);
        });
});
app.get('/list_graphs', function (req, res) {
    var query = JSON.stringify({
        'query': 'MATCH (n) RETURN n'
    });
    return cypher
        .query(query)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error) {
            res.json(error);
        });
});
/*UPLOAD A SINGLE FILE AT /UPLOADS DEFINED ON VARIABLE storage AT SCOPE*/
/*
labels: node1:label1,node2:label2
*/
app.post('/load_graph', upload.single('file'), function (req, res) {
    console.log('teste');
    console.log(req.file.originalname);
    var labels = [], format = utility._getFormat(req.file.originalname);
    console.log(format);
    return files
        .convertToBDRestPattern(nameData+req.file.originalname, format, req.body.labels)
		.then(function (results) {
			 /*return cypher
			.statements(JSON.stringify(body))
			.then(function (results) {*/
            console.log(results);
            results = JSON.parse(results);
            if (results.errors.length !== 0) {
                return res.status(500).json({
                    'status': LOAD_ERROR,
                    'message': 'Error in file s data!',
                    'system_response': results.errors 
                });   
            }
			return res.status(200).json({
                'status': LOAD_SUCCESS,
                'message': 'success'
            });
			/*})
			.catch( function (err) {
                console.log(err);
                console.log('aqui2323');
                throw new Error(err);
			});*/
		})
        .catch( function (err) {
            console.log(JSON.stringify(err));
            res.status(500).json({
                'status': LOAD_ERROR,
                'message': 'File were not inserted!',
                'system_response': err
            });
        })
        .done();
});
app.post('/delete_all', function (req, res) {
    var query = JSON.stringify({
        'query': 'MATCH (n)'+
                ' OPTIONAL MATCH (n)-[r]-()'+
                ' DELETE n,r'
    });
    return cypher
            .query(query)
            .then(function (result) {
                res.status(200).json({
                    'status': DELETE_SUCCESS,
                    'message': 'success'
                });
            })
            .catch(function (err) {
                res.status(500).json({
                    'status': DELETE_ERROR,
                    'message': 'File were not deleted!',
                    'system_response': err
                })
            });
});

function _generalReturn (req, res, query) {
    //console.log(query);
    cypher
    .query(query)
    .then(function (result) {
        var graphs = JSON.parse(result).data,
            systemResponse = utility._relationshipResponse(graphs),
            string = "", format,
            allGraphs = translate.convertToEL(systemResponse),
            numbOfGraphs = allGraphs.count,
            fileName =  crypto
                        .createHmac("md5", "password")
                        .update(Date.now().toString())
                        .digest('hex')+'_'+numbOfGraphs+'.el';
        if (systemResponse.length == 0) {
            res.status(200).json({
                'status': GET_SUCCESS,
                'message': "No results were finds!"
            });
        }
        else if (req.query.download == "y") {
            //if (typeof req.query.output_format !== 'undefined')
                string = allGraphs.graphs;
            //}
            format = req.query.output_format;
            fs.writeFile(downloads+fileName, string, 'utf8', function (err) {
                if (err) return console.log(err);
            });
            res.status(200).json({
                'status': GET_SUCCESS,
                'message': 'File name is'+fileName
            });
        }
        else if (req.query.number_of_graphs == "y") {
            if (numbOfGraphs > 1)
                 res.status(200).json({
                    'status': GET_SUCCESS,
                    'message': "There are "+numbOfGraphs+" graphs in this file"
                });
            res.status(200).json({
                'status': GET_SUCCESS,
                'message': "There is "+numbOfGraphs+" graphs in this file"
            });
        }
        else 
         res.status(200).json({
            'status': GET_SUCCESS,
            'message': systemResponse
        });
    })
    .catch(function (err) {
        res.status(500).json({ 
            'error': GET_ERROR,
            'message': 'System error during search. Try again later!',
            'system_response': err 
        });
    });
}

function _returnGraphProps(req, res, query, props) {
    cypher
    .query(query)
    .then(function (results) {
        //var objectProps = translate.getPropValue(JSON.parse(results));
        console.log(JSON.stringify(JSON.parse(results).data[0][0]));
    })
    .catch(function (err) {
        res.status(500).json({ 
            'error': GET_ERROR,
            'message': 'System error during search. Try again later!',
            'system_response': err 
        });
    });
}

/*NODE QUERY FOR EDGES*/
app.get('/get_edge_betweenness_centrality', function (req, res) {
    var  query = JSON.stringify({
            'query': 'MATCH (m)  WHERE m.node="virtual"'+
					' WITH COLLECT(m) as virtuals'+
					' UNWIND virtuals as virtual'+
					' MATCH p=(n)-[r]->(v) WHERE'+ 
                    ' r.betweenness_centrality<="'+req.query.max+'"'+
					' and r.betweenness_centrality>="'+req.query.min+'"'+
					' and n.key=virtual.key and v.key=virtual.key'+
					' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
					' COLLECT(nodes(p)) as graphs'+
					' WHERE count = number_of_edges'+
					' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
}); 

/*NODE QUERIES FOR VIRTUAL NODES*/
app.get('/get_virtual_degree', function (req, res) {
    filter._propValidation(req.query);
    var name = {
                'min': 'minimum_degree',
                'max': 'maximum_degree'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_transmission', function (req, res) {
    filter._propValidation(req.query);
    var name = {
                'min': 'minimum_transmission',
                'max': 'maximum_transmission'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_vertex_betweenness_centrality', function (req, res) {
    filter._propValidation(req.query);
    var name = {
                'min': 'minimum_vertex_betweenness_centrality',
                'max': 'maximum_vertex_betweenness_centrality'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_edge_betweenness_centrality', function (req, res) {
    filter._propValidation(req.query);
    var name = {
                'min': 'minimum_edge_betweenness_centrality',
                'max': 'maximum_edge_betweenness_centrality'
            },
        query =  JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_closeness_centrality', function (req, res) {
    filter._propValidation(req.query);
    var name = {
                'min': 'minimum_closeness_centrality',
                'max': 'maximum_closeness_centrality'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_edge_connectivity', function (req, res) {
    var name = {
                'min': 'edge_connectivity',
                'max': 'edge_connectivity'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_vertex_connectivity', function (req, res) {
    var name = {
                'min': 'vertex_connectivity',
                'max': 'vertex_connectivity'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_wiener_index', function (req, res) {
    var name = {
                'min': 'wiener_index',
                'max': 'wiener_index'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_diameter', function (req, res) {
    var name = {
                'min': 'diameter',
                'max': 'diameter'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_radius', function (req, res) {
    var name = {
                'min': 'radius',
                'max': 'radius'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_average_distance', function (req, res) {
    var name = {
                'min': 'average_distance',
                'max': 'average_distance'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_edge_density', function (req, res) {
     var name = {
                'min': 'edge_density',
                'max': 'edge_density'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_number_of_edges', function (req, res) {
     var name = {
                'min': 'number_of_edges',
                'max': 'number_of_edges'
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    return _generalReturn(req, res, query);
});
app.get('/get_virtual_number_of_vertices', function (req, res) {
     var name = {
                'min': 'number_of_vertices',
            },
        query = JSON.stringify({
                'query': 'MATCH (m)  WHERE m.node="virtual"'+
				filter._checkPropCase(name, req.query)+
				' WITH COLLECT(m) as virtuals'+
				' UNWIND virtuals as virtual'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=virtual.key and v.key=virtual.key'+
				' WITH n.key as key, COUNT(r) as count, virtual.number_of_edges as number_of_edges,'+
				' COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs'
        });
    //utility._checkReqQuery(req);
    return _generalReturn(req, res, query);
});
app.post('/get_graphs', function (req, res) {
    var query = JSON.stringify({
        'query': filter.propsQueriesquerys(req.body)
    });
    console.log(query);
    return _generalReturn(req, res, query);
});

app.post('/create_comp_graphs', function (req, res) {
    var aux = filter.propsQueriesquerys(req.body, true);
    var query = JSON.stringify({
        'query': aux.cypher
    });
    console.log(query);
    return _returnGraphProps(req, res, query, aux.props);
});
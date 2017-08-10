var nodes;

nodes = module.exports = {
	_propValidation: function (prop) {
		if (typeof prop.min == 'undefined' || typeof prop.max == 'undefined') {
			throw new Error("Sorry, but you cannot looking for this property"+
							" without define min or max!");
		}
	},
	_arrayProps: function (name, prop, arrayOfProps) {
		if (typeof prop.value !== 'undefined') 
			arrayOfProps.push(name.min);
		else if (JSON.stringify(name.min) ==  JSON.stringify(name.max))
			arrayOfProps.push(name.min);
		else {
			if (typeof prop.min !== 'undefined') 
				arrayOfProps.push(name.min);
			if (typeof prop.max !== 'undefined') 
				arrayOfProps.push(name.max);
			else
				throw new Error("Please, insert correct property value!");
		}
		return arrayOfProps;
	},
	_returnProp: function (name, prop) {
		var filter = "";
		if (typeof prop.value !== 'undefined') 
			filter = ', '+name.min;
		else if (JSON.stringify(name.min) ==  JSON.stringify(name.max))
			filter += ', '+name.min;
		else {
			if (typeof prop.min !== 'undefined') 
				filter += ', '+name.min;
			if (typeof prop.max !== 'undefined') 
				filter += ', '+name.max;
			else
				throw new Error("Please, insert correct property value!");
		}
		return filter;
	},
	_withProp: function (name, prop) {
		var filter = "", propName;
		if (typeof prop.value !== 'undefined') 
			filter = ', root.'+name.min+' as '+name.min;
		else if (JSON.stringify(name.min) ==  JSON.stringify(name.max))
			filter = ', root.'+name.min+' as '+name.min;
		else {
			if (typeof prop.min !== 'undefined')
				filter += ', root.'+name.min+' as '+name.min;
			if (typeof prop.max !== 'undefined')
				filter += ', root.'+name.max+' as '+name.max;
			else
				throw new Error("Please, insert correct property value!");
		}
		return filter;
	},
	_checkPropCase: function (name, prop) {
		var filter = "", propName;
		if (typeof prop.value !== 'undefined') {
			filter = ' and m.'+name.min+"="+prop.value;
		}
		else {
			if (typeof prop.min !== 'undefined')
				filter += ' and m.'+name.min+">="+prop.min;
			if (typeof prop.max !== 'undefined')
				filter += ' and m.'+name.max+"<="+prop.max;
			else
				throw new Error("Please, insert correct property value!");
		}
		return filter;
	},
	nodeLeaf: function (nodeProp, aux, key, label) {
		return props = {
			'node': nodeProp.vertices[aux],
			'label': label,
			'graph': nodeProp.graph,
			'key': key,
			'degree': nodeProp.vertices_degree[aux],
			'eccentricity': nodeProp.vertices_eccentricity[aux],
			'transmission': nodeProp.vertices_transmissions[aux],
			'vertex_betweenness_centrality': nodeProp.vertices_betweenness_centrality[aux],
			//'adjusted_vertex_betweenness_centrality': nodeProp.vertices_adjusted_vertex_betweenness_centrality[aux],
			'closeness_centrality': nodeProp.vertices_closeness_centrality[aux]

		}
	},
	nodeLeafDrive: function (nodeProp, aux, key, label) {
		return props = '{'+
			'node:"'+nodeProp.vertices[aux]+'",'+
			'label:"'+ label+'",'+
			'graph:"'+ nodeProp.graph+'",'+
			'key:"'+ key+'",'+
			'degree:"'+ nodeProp.vertices_degree[aux]+'",'+
			'eccentricity:"'+ nodeProp.vertices_eccentricity[aux]+'",'+
			'transmission:"'+ nodeProp.vertices_transmissions[aux]+'",'+
			'vertex_betweenness_centrality:"'+ nodeProp.vertices_betweenness_centrality[aux]+'",'+
			//'adjusted_vertex_betweenness_centrality': nodeProp.vertices_adjusted_vertex_betweenness_centrality[aux],
			'closeness_centrality:"'+ nodeProp.vertices_closeness_centrality[aux]+'"}';

	},
	nodeRoot: function (rootProps, key) {
		return props = {
			'node': 'virtual',
			'graph': rootProps.graph,
			'key': key,
			'number_of_vertices': rootProps.number_of_vertices,
			'number_of_edges': rootProps.number_of_edges,
			'edge_density': rootProps.edge_density,
			'average_distance': rootProps.average_distance,
			'radius': rootProps.radius,
			'diameter': rootProps.diameter,
			'wiener_index': rootProps.Wiener_index,
			'minimum_transmission': rootProps.minimum_transmission,
			'maximum_transmission': rootProps.maximum_transmission,
			//'average_degree': rootProps.average_degree,
			'minimum_degree': rootProps.minimum_degree,
			'maximum_degree': rootProps.maximum_degree,
			'vertex_connectivity': rootProps.vertex_connectivity,
			'edge_connectivity': rootProps.edge_connectivity,
			//'algebraic_connectivity': rootProps.,
			'minimum_vertex_betweenness_centrality': rootProps.minimum_vertex_betweenness_centrality,
			'maximum_vertex_betweenness_centrality': rootProps.maximum_vertex_betweenness_centrality,
			/*'minimum_adjusted vertex_betweenness_centrality': rootProps.minimum_adjusted_vertex_betweenness_centrality,
			'maximum_adjusted vertex_betweenness_centrality': rootProps.maximum_adjusted_vertex_betweenness_centrality,*/
			'minimum_edge_betweenness_centrality': rootProps.minimum_edge_betweenness_centrality,
			'maximum_edge_betweenness_centrality': rootProps.maximum_edge_betweenness_centrality,
			'minimum_closeness_centrality': rootProps.minimum_closeness_centrality,
			'maximum_closeness_centrality': rootProps.maximum_closeness_centrality
		}
	},
	nodeVirtualDriver: function (rootProps) {
		//console.log("rootProps::"+JSON.stringify(rootProps));
		return props = {
			'graph': rootProps.graph,
			'number_of_vertices': rootProps.number_of_vertices,
			'number_of_edges': rootProps.number_of_edges,
			'edge_density': rootProps.edge_density,
			'average_distance': rootProps.average_distance,
			'radius': rootProps.radius,
			'diameter': rootProps.diameter,
			'wiener_index': rootProps.Wiener_index,
			'minimum_transmission': rootProps.minimum_transmission,
			'maximum_transmission': rootProps.maximum_transmission,
			//'average_degree': rootProps.average_degree,
			'minimum_degree': rootProps.minimum_degree,
			'maximum_degree': rootProps.maximum_degree,
			'vertex_connectivity': rootProps.vertex_connectivity,
			'edge_connectivity': rootProps.edge_connectivity,
			//'algebraic_connectivity': rootProps.,
			'minimum_vertex_betweenness_centrality': rootProps.minimum_vertex_betweenness_centrality,
			'maximum_vertex_betweenness_centrality': rootProps.maximum_vertex_betweenness_centrality,
			/*'minimum_adjusted vertex_betweenne:'+ss_centrality': rootProps.minimum_adjusted_vertex_betweenness_centrality,
			'maximum_adjusted vertex_betweenness_centrality': rootProps.maximum_adjusted_vertex_betweenness_centrality,*/
			'minimum_edge_betweenness_centrality': rootProps.minimum_edge_betweenness_centrality,
			'maximum_edge_betweenness_centrality': rootProps.maximum_edge_betweenness_centrality,
			'minimum_closeness_centrality': rootProps.minimum_closeness_centrality,
			'maximum_closeness_centrality': rootProps.maximum_closeness_centrality
		};
	},

	virtualNodeProps: function (key) {
		return props = '{'+
			'node: "virtual",'+
			'key:"'+ key+'",'+
			'graph: {graph},'+
			'number_of_vertices: {number_of_vertices},'+
			'number_of_edges: {number_of_edges},'+
			'edge_density: {edge_density},'+
			'average_distance: {average_distance},'+
			'radius: {radius},'+
			'diameter: {diameter},'+
			'wiener_index: {wiener_index},'+
			'minimum_transmission: {minimum_transmission},'+
			'maximum_transmission: {maximum_transmission},'+
			//'average_degree': rootProps.average_degree,
			'minimum_degree: {minimum_degree},'+
			'maximum_degree: {maximum_degree},'+
			'vertex_connectivity: {vertex_connectivity},'+
			'edge_connectivity: {edge_connectivity},'+
			//'algebraic_connectivity': rootProps.,
			'minimum_vertex_betweenness_centrality: {minimum_vertex_betweenness_centrality},'+
			'maximum_vertex_betweenness_centrality: {maximum_vertex_betweenness_centrality},'+
			/*'minimum_adjusted vertex_betweenness_centrality': rootProps.minimum_adjusted_vertex_betweenness_centrality,
			'maximum_adjusted vertex_betweenness_centrality': rootProps.maximum_adjusted_vertex_betweenness_centrality,*/
			'minimum_edge_betweenness_centrality: {minimum_edge_betweenness_centrality},'+
			'maximum_edge_betweenness_centrality: {maximum_edge_betweenness_centrality},'+
			'minimum_closeness_centrality: {minimum_closeness_centrality},'+
			'maximum_closeness_centrality: {maximum_closeness_centrality} }';
	},

	propsQueriesquerys: function (graph, loadProps) {
		var query = 'MATCH (m:Virtual) WHERE m.node="virtual"',
			name = '',
			returnCypher = '',
			withCypher = '',
			arrayOfProps = [];
		if (typeof graph.label !== 'undefined') {
			query += ' and m.label="'+graph.label+'"';
		}			
		if (typeof graph.degree !== 'undefined') {
			this._propValidation(graph.degree);
			name = {
				'min': 'minimum_degree',
				'max': 'maximum_degree'
			};
			query += this._checkPropCase(name, graph.degree);
			if (loadProps) {
			 returnCypher += this._returnProp(name, graph.degree);
			 withCypher += this._withProp(name, graph.degree);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
		}
	    if (typeof graph.transmission !== 'undefined') {
	    	this._propValidation(graph.transmission);
	    	name = {
				'min': 'minimum_transmission',
				'max': 'maximum_transmission'
			};
	    	query += this._checkPropCase(name, graph.transmission);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.transmission);
			 withCypher += this._withProp(name, graph.transmission);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.vertex_betweenness_centrality !== 'undefined') {
	    	this._propValidation(graph.vertex_betweenness_centrality);
	    	name = {
				'min': 'minimum_vertex_betweenness_centrality',
				'max': 'maximum_vertex_betweenness_centrality'
			};
	    	query += this._checkPropCase(name, graph.vertex_betweenness_centrality);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.vertex_betweenness_centrality);
			 withCypher += this._withProp(name, graph.vertex_betweenness_centrality);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.edge_betweenness_centrality !== 'undefined') {
	    	this._propValidation(graph.edge_betweenness_centrality);
	    	name = {
				'min': 'minimum_edge_betweenness_centrality',
				'max': 'maximum_edge_betweenness_centrality'
			};
	    	query += this._checkPropCase(name, graph.edge_betweenness_centrality);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.edge_betweenness_centrality);
			 withCypher += this._withProp(name, graph.edge_betweenness_centrality);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.closeness_centrality !== 'undefined') {
	    	this._propValidation(graph.closeness_centrality);
	    	name = {
				'min': 'minimum_closeness_centrality',
				'max': 'maximum_closeness_centrality'
			};
	    	query += this._checkPropCase(name, graph.closeness_centrality);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.closeness_centrality);
			 withCypher += this._withProp(name, graph.closeness_centrality);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.edge_connectivity !== 'undefined') {
	    	name = {
				'min': 'edge_connectivity',
				'max': 'edge_connectivity'
			};
	    	query += this._checkPropCase(name, graph.edge_connectivity);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.edge_connectivity);
			 withCypher += this._withProp(name, graph.edge_connectivity);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.vertex_connectivity !== 'undefined') {
	    	name = {
				'min': 'vertex_connectivity',
				'max': 'vertex_connectivity'
			};
	    	query += this._checkPropCase(name, graph.vertex_connectivity);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.vertex_connectivity);
			 withCypher += this._withProp(name, graph.vertex_connectivity);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.wiener_index !== 'undefined') {
	    	name = {
				'min': 'wiener_index',
				'max': 'wiener_index'
			};
	    	query += this._checkPropCase(name, graph.wiener_index);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.wiener_index);
			 withCypher += this._withProp(name, graph.wiener_index);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.diameter !== 'undefined') {
	    	name = {
				'min': 'diameter',
				'max': 'diameter'
			};
	    	query += this._checkPropCase(name, graph.diameter);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.diameter);
			 withCypher += this._withProp(name, graph.diameter);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.radius !== 'undefined') {
	    	name = {
				'min': 'radius',
				'max': 'radius'
			};
	    	query += this._checkPropCase(name, graph.radius);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.radius);
			 withCypher += this._withProp(name, graph.radius);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.average_distance !== 'undefined') {
	    	name = {
				'min': 'average_distance',
				'max': 'average_distance'
			};
	    	query += this._checkPropCase(name, graph.average_distance);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.average_distance);
			 withCypher += this._withProp(name, graph.average_distance);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.edge_density !== 'undefined') {
	    	name = {
				'min': 'edge_density',
				'max': 'edge_density'
			};
	    	query += this._checkPropCase(name, graph.edge_density);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.edge_density);
			 withCypher += this._withProp(name, graph.edge_density);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.number_of_edges !== 'undefined') {
	    	name = {
				'min': 'number_of_edges',
				'max': 'number_of_edges'
			};
	    	query += this._checkPropCase(name, graph.number_of_edges);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.number_of_edges);
			 //withCypher += this._withProp(name, graph.number_of_edges);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.number_of_vertices !== 'undefined') {
	    	name = {
				'min': 'number_of_vertices',
				'max': 'number_of_vertices'
			};
	    	query += this._checkPropCase(name, graph.number_of_vertices);
	    	if (loadProps) {
			 returnCypher += this._returnProp(name, graph.number_of_vertices);
			 withCypher += this._withProp(name, graph.number_of_vertices);
			 arrayOfProps = this._arrayProps(name, graph.degree, arrayOfProps);
			}
	    }
	    if (typeof graph.key !== 'undefined') {
	    	query += ' and m.key="'+graph.key+'"';
	    }
	    

		/*if (loadProps) {
	    	query += ' WITH COLLECT(m) as roots'+
				' UNWIND roots as root'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=root.key and v.key=root.key'+
				' WITH n.key as key, COUNT(r) as count, root.number_of_edges as number_of_edges,'+
				' root as virtual'+withCypher + ', COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs, virtual';
	    	return {
	    		'cypher': query,
	    		'props': arrayOfProps
	    	}
		}
		query += ' WITH COLLECT(m) as roots'+
				' UNWIND roots as root'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=root.key and v.key=root.key'+
				' WITH n.key as key, COUNT(r) as count, root.number_of_edges as number_of_edges'+
				withCypher + ', COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs';*/
            /*if (loadProps) {
                query += ' WITH COLLECT(m) as roots'+
                                ' UNWIND roots as root'+
                                ' MATCH p=(n)-[r]->(v) WHERE n.key=root.key and v.key=root.key'+
                                ' RETURN p, root';
                return {
                        'cypher': query,
                        'props': arrayOfProps
                }
                }
                query += ' WITH COLLECT(m) as roots'+
                                ' UNWIND roots as root'+
                                ' MATCH p=(n:Vertice)-[r]->(v:Vertice) WHERE n.key=root.key and v.key=root.key'+
                                ' RETURN p, root';
	 	*/
		// query += ' RETURN COUNT(m)' ;

		return query;
	},
    
    returnFromNeo4j: function (numberGraphs, withCypher)
    {
        if (typeof numberGraphs != 'undefined' && numberGraphs == 'y')
            return ' RETURN COUNT(m)';
        
        return ' WITH COLLECT(m) as roots'+
                ' UNWIND roots as root'+
                ' MATCH p=(n)-[r]->(v) WHERE n.key=root.key and v.key=root.key'+
                ' WITH n.key as key, COUNT(r) as count, root.number_of_edges as number_of_edges'+
                ', COLLECT(nodes(p)) as graphs'+
                ' WHERE count = number_of_edges'+
                ' RETURN graphs';
            
    },

	_returnForAllGraph: function (withCypher) {
		return  ' WITH COLLECT(m) as roots'+
                                ' UNWIND roots as root'+
                                ' MATCH p=(n)-[r]->(v) WHERE n.key=root.key and v.key=root.key'+
                                ' RETURN p, root';
/*' WITH COLLECT(m) as roots'+
				' UNWIND roots as root'+
				' MATCH p=(n)-[r]->(v) WHERE n.key=root.key and v.key=root.key'+
				' WITH n.key as key, COUNT(r) as count, root.number_of_edges as number_of_edges,'+
				' root as virtual'+withCypher + ', COLLECT(nodes(p)) as graphs'+
				' WHERE count = number_of_edges'+
				' RETURN graphs, virtual';*/
	}
}

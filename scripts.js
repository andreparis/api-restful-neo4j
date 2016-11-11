var child_process = require('child_process'),
	promise = require('bluebird'),
	setupPaths = require('./setup');
	
var scripts = module.exports = {
	_checkProp: function (prop) {
		for (var aux = 0; aux < prop.vertices_degree.length; aux ++) {
			if (typeof prop.vertices_degree[aux] == 'undefined') {
				return true;
			}
		}
		for (var aux = 0; aux < prop.vertices_eccentricity.length; aux ++) {
			if (typeof prop.vertices_eccentricity[aux] == 'undefined') {
				return true;
			}
		}
		for (var aux = 0; aux < prop.vertices_transmissions.length; aux ++) {
			if (typeof prop.vertices_transmissions[aux] == 'undefined') {
				return true;
			}
		}
		for (var aux = 0; aux < prop.vertices_betweenness_centrality.length; aux ++) {
			if (typeof prop.vertices_betweenness_centrality[aux] == 'undefined') {
				return true;
			}
		}
		/*for (var aux = 0; aux < prop.vertices_adjusted_vertex_betweenness_centrality.length; aux ++) {
			if (typeof prop.vertices_adjusted_vertex_betweenness_centrality[aux] == 'undefined') {
				return true;
			}
		}*/
		for (var aux = 0; aux < prop.vertices_closeness_centrality.length; aux ++) {
			if (typeof prop.vertices_closeness_centrality[aux] == 'undefined') {
				return true;
			}
		}
		if(typeof prop.number_of_vertices == 'undefined') {
			return true;
		}
		else if (typeof prop.number_of_edges == 'undefined') {
			return true;
		}
		else if (typeof prop.edge_density == 'undefined') {
			return true;
		}
		else if (typeof prop.average_distance == 'undefined') {
			return true;
		}
		else if (typeof prop.radius == 'undefined') {
			return true;
		}
		else if (typeof prop.diameter == 'undefined') {
			return true;
		}
		else if (typeof prop.Wiener_index == 'undefined') {
			return true;
		}
		else if (typeof prop.minimum_transmission == 'undefined') {
			return true;
		}
		else if (typeof prop.maximum_transmission == 'undefined') {
			return true;
		}
		/*else if (typeof prop.average_degree == 'undefined') {
			return true;
		}*/
		else if (typeof prop.minimum_degree == 'undefined') {
			return true;
		}
		else if (typeof prop.maximum_degree == 'undefined') {
			return true;
		}
		else if (typeof prop.vertex_connectivity == 'undefined') {
			return true;
		}
		else if (typeof prop.edge_connectivity == 'undefined') {
			return true;
		}
		/*else if (typeof prop.algebraic_connectivity == 'undefined') {
			return true;
		}*/
		else if (typeof prop.minimum_vertex_betweenness_centrality == 'undefined') {
			return true;
		}
		else if (typeof prop.maximum_vertex_betweenness_centrality == 'undefined') {
			return true;
		}
		/*else if (typeof prop.minimum_adjusted_vertex_betweenness_centrality == 'undefined') {
			return true;
		}
		else if (typeof prop.maximum_adjusted_vertex_betweenness_centrality == 'undefined') {
			return true;
		}*/
		else if (typeof prop.minimum_edge_betweenness_centrality == 'undefined') {
			return true;
		}
		else if (typeof prop.maximum_edge_betweenness_centrality == 'undefined') {
			return true;
		}
		else if (typeof prop.minimum_closeness_centrality == 'undefined') {
			return true;
		}
		else if (typeof prop.maximum_closeness_centrality == 'undefined') {
			return true;
		}
		return false;
	},
	_convertDivisionToFloat: function (string) {
		var i = 0, dividend = "", divisor = "", aux = false, product;
		while (i < string.length) {
			if ((string[i] !== '/') && (!aux)) {
				dividend = dividend+string[i];
			}
			else{
				if (string[i] == '/')
					aux = true;
				else if ((string[i] !== '/') && (aux))
					divisor = divisor+string[i];
			} 
			i++;
		}
		product = parseFloat(dividend)/parseFloat(divisor);
		return product;
	},
	_getProperty: function (string, i, isVertice) {
		//i = 0 ? 0 : i++;
		var prop = "", aux = false, auxList = false, list = [];
		while (string[i] !== 'N') {
			if (string[i] == '-') {
				break;
			}
			if (string[i] == '{') 
				auxList = true;
			else if (string[i] !== ',' && string[i] !== '}') {
				prop = prop + string[i];
				if (string[i] == '/')
					aux = true;
			}
			else if (prop == 'List')
				prop = "";
			else if(auxList) {
				prop = aux ? this._convertDivisionToFloat(prop) : prop;
				if (!isVertice)
					prop = parseFloat(prop);
				else
					prop = prop.trim();
				list.push(prop);
				prop = "";
			}
			i++;
		}
		if (list.length !== 0) 
			prop = list;
		else {
			prop = aux ? this._convertDivisionToFloat(prop) : prop;
			prop = parseFloat(prop);
		}
		i++;
		return {
			'prop': prop,
			'position': parseFloat(i)
		};
	},
	execute: function (scriptName) {
		return new promise ( function (resolve, reject) {
			var child = child_process.exec(scriptName, {
				//Change on server
				'maxBuffer': 1024*99999999999999999999
			}, function(error, stdout, stderr) {
				if (error !== null) {
					error.child = child; //monkeypatch the error with a custom .child property.
					reject(error);
					throw new Error(error);
				} 
				resolve({
						'child': child, 
						'stdout': stdout, 
						'stderr': stderr
				}); //all available data bundled into a single object.
			});
		});
			
	},
	mathematicaGraphProperties: function (string) {
		var properties = {'props': []}, prop = {}, getAttribute,
			i = 0;
		//console.log(string.length);
		while (i < string.length) {
			prop = {};
			/*Line of graph number*/
			getAttribute = this._getProperty(string, i, false);
			prop.graph = getAttribute.prop;
			/*Number of Vertices*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.number_of_vertices = getAttribute.prop;
			/*Number Of Edges*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.number_of_edges = getAttribute.prop;
			/*Edge density*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.edge_density = getAttribute.prop;
			/*Average Distance*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.average_distance = getAttribute.prop;
			/*Radius*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.radius = getAttribute.prop;
			/*Diameter*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.diameter = getAttribute.prop;
			/*Wiener Index*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.Wiener_index = getAttribute.prop;
			/*Min transmission*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.minimum_transmission = getAttribute.prop;
			/*Max transmission*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.maximum_transmission = getAttribute.prop;
			/*Min degree*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.minimum_degree = getAttribute.prop;
			/*Max degree*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.maximum_degree = getAttribute.prop;
			/*Vertex connectivity*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.vertex_connectivity = getAttribute.prop;
			/*Edge connectivity*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.edge_connectivity = getAttribute.prop;
			/*Min vertex betweenes*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.minimum_vertex_betweenness_centrality = getAttribute.prop;
			/*Max vertex betweenes*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.maximum_vertex_betweenness_centrality = getAttribute.prop;
			/*Min Edge betweenes*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.minimum_edge_betweenness_centrality = getAttribute.prop;
			/*Max Edge betweenes*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.maximum_edge_betweenness_centrality = getAttribute.prop;
			/* Min Closeness Centrality*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.minimum_closeness_centrality = getAttribute.prop;
			/*Max Closeness Centrality*/
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			prop.maximum_closeness_centrality = getAttribute.prop;
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			/*Edge Betweenness Centrality*/
			prop.edge_betweenness_centrality = getAttribute.prop;
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			/*Vertices Degree*/
			prop.vertices_degree = getAttribute.prop;
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			/*Vertices Betweenness Centrality*/
			prop.vertices_betweenness_centrality = getAttribute.prop;
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			/*Vertices Closeness Centrality*/
			prop.vertices_closeness_centrality = getAttribute.prop;
			i = getAttribute.position;
			getAttribute = this._getProperty(string, i, false);
			/*Vertices Transmissions*/
			prop.vertices_transmissions = getAttribute.prop;
			i = getAttribute.position;
			/*Vertices list*/
			getAttribute = this._getProperty(string, i, true);
			prop.vertices = getAttribute.prop;
			i = getAttribute.position;
			/*Vertices Eccentricity*/
			getAttribute = this._getProperty(string, i, false);
			prop.vertices_eccentricity = getAttribute.prop;
			i = getAttribute.position;
			//console.log("prop:::"+prop);
			if (this._checkProp(prop)) {
				console.log("entrou no erro!!");
				return 'undefined';
			}
			properties.props.push(prop);
		}
		return properties;
	},
}


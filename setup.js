var BASEPATH = '"C:\\Users\\Andre\\Documents\\Projeto LabTel\\API-RESTful\\';

var setup = module.exports = {

	getMathematicaPath: function () {
		return 'math'+
			' -script '+BASEPATH+'scripts\\mathematica.m" '+BASEPATH+'uploads\\';
	},
	getShowgPath: function () {
		return BASEPATH+'scripts\\showg.exe"';
	},
	getUploadedFilePath: function () {
		return 'uploads\\';
	},
	getScriptsPath: function () {
		return BASEPATH+'scripts\\';
	},
	getMatheticaCompPath: function() {
		return 'math'+
			' -script '+BASEPATH+'scripts\\mathematica_comp.m" '+BASEPATH+'comp\\'; 
	},
	getOS: function () {
		/*
		Set:
		0 - Windows
		1 - Linux
		*/
		return 0;
	}
}
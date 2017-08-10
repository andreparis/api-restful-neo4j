var BASEPATH = '"C:\\Users\\Andre\\Documents\\Projeto LabTel\\api-restful-neo4j\\';

var setup = module.exports = {

	getMathematicaPath: function () {
		return 'math -script scripts\\mathematica.m '+
			'uploads\\';
	},
	getJuliaPath: function () {
		return 'julia '+BASEPATH+'scripts\\Julia.jl" uploads\\'
	},
	getShowgPath: function () {
		return BASEPATH+'scripts\\showg.exe" ';
	},
	getUploadedFilePath: function () {
		return 'uploads\\';
	},
	getScriptsPath: function () {
		return BASEPATH+'scripts\\';
	},
	getOS: function () {
		/*
		Set:
		0 - Windows
		1 - Linux
		*/
		return 1;
	},
	getMatheticaCompPath: function() {
		return 'math -script scripts/mathematica_comp.m '+
			BASEPATH+'/comp/'; 
	}
}
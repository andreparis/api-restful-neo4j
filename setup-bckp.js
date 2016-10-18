var setup = module.exports = {
	getMathematicaPath: function () {
		return 'math -script scripts/mathematica.m'+
			' /home/marcia/Desktop/AndreParis/API-JavaScript-2.0-master/uploads/';
	},
	getShowgPath: function () {
		return './scripts/showg';
	},
	getUploadedFilePath: function () {
		return '/home/marcia/Desktop/AndreParis/API-JavaScript-2.0-master/uploads/';
	},
	getScriptsPath: function () {
		return 'C:\\Users\\Andre\\Documents\\Projeto LabTel\\API JavaScript\\scripts\\';
	},
	getOS: function () {
		/*
		Set:
		0 - Windows
		1 - Linux
		*/
		return 1;
	}
}
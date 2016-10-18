var setup = module.exports = {
	getMathematicaPath: function () {
		return 'math'+
			' -script "C:\\Users\\Andre\\Documents\\Projeto LabTel\\API JavaScript V2.0\\scripts\\mathematica.m"'+
			' "C:\\Users\\Andre\\Documents\\Projeto LabTel\\API JavaScript V2.0\\uploads\\';
	},
	getShowgPath: function () {
		return '"C:\\Users\\Andre\\Documents\\Projeto LabTel\\API JavaScript V2.0\\scripts\\showg.exe"';
	},
	getUploadedFilePath: function () {
		return 'uploads\\';
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
		return 0;
	}
}
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
var server = module.exports = {
	_init: function (req, res) {
		var server = app.listen(8081, function () {
			var host = server.address().address;
			var port = server.address().port;
			console.log("Listening at http://%s:%s", host, port);
		});
		server.timeout = 0;
		return app;
	}
}
APP_PATH = __dirname + '/app';
FILE_PATH = __dirname + '/public';
var http = require('http');
var bootstrap = require('./lib/bootstrap');
var config = require('./config');

config.app_path = APP_PATH;
config.file_path = FILE_PATH;

var server = http.createServer(function(req, res){
	//req.setEncoding('utf8');
	bootstrap.run(req, res);
});
server.listen(config.serverinfo.port);

console.log('Server running... listening port:' + config.serverinfo.port);

APP_PATH = __dirname + '/app';
FILE_PATH = __dirname + '/public';
var http = require('http');
var bootstrip = require('./lib/bootstrip');
var config = require('./config');
var querystring = require('querystring');

var server = http.createServer(function(req, res){
	//req.setEncoding('utf8');
	bootstrip.run(req, res);
});
server.listen(config.serverinfo.port);

console.log('Server running... listening port:' + config.serverinfo.port);

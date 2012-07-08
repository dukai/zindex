APP_PATH = __dirname + '/app';
FILE_PATH = __dirname + '/public';
var http = require('http');
var bootstrip = require('./lib/bootstrip');
var config = require('./config');
var debug = require('./lib/utils/debug').debug;




var server = http.createServer(function(req, res){
	
	bootstrip.run(req, res);
	
});

server.listen(config.serverinfo.port);

console.log('Server running... listening port:' + config.serverinfo.port);

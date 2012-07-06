var http = require('http');
var bootstrip = require('./lib/bootstrip');
var config = require('./config');

APP_PATH = __dirname + '/app';

var server = http.createServer(function(req, res){
	
	bootstrip.run(req, res);
	
});

server.listen(config.serverinfo.port);

console.log('Server running...');
console.log(__dirname);

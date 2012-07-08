var fc = require('./front_controller');

exports.run = function(req, res){
	//res.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
	//res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	var routeConfig = "routeConfig";
	fc.setRouteConfig(routeConfig);
	fc.route(req, res);
	//res.end();
}

var writeBody = function(req, res){
	res.write("<html>\
	<head>\
		<title>Hello world!</title>\
	<head>\
	<body>\
		<h1>HELLO WORLD!</h1>\
		<p>How ary U!</p>\
	</body>\
	</html>");
}

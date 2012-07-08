var fc = require('./front_controller');

exports.run = function(req, res){
	//res.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
	//res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	
	//fc.setRouteConfig(routeConfig);
	fc.route(req, res);
	//res.end();
}

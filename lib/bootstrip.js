var fc = require('./front_controller');

exports.run = function(req, res){
	//res.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
	//res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	
	//fc.setRouteConfig(routeConfig);
	
	if(req.method == "POST"){
	
		var postData = '';
		req.addListener('data', function(chunk){
			postData += chunk;
		});
		
		req.addListener('end', function(){
			//console.log(postData);
		});
	}
	
	
	fc.route(req, res);
	//res.end();
}

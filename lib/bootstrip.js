var fc = require('./front_controller'),
	formidable = require('formidable'),
	util = require('util');

exports.run = function(req, res){
	//res.setHeader("Set-Cookie", ["type=ninja", "language=javascript"]);
	//res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
	
	//fc.setRouteConfig(routeConfig);
	
	if(req.method == "POST"){
		var form = new formidable.IncomingForm();
		form.parse(req, function(err, fields, files) {
			console.log(util.inspect({fields: fields, files: files}))
		});
		var postData = '';
		req.addListener('data', function(chunk){
			postData += chunk;
		});
		
		req.addListener('end', function(){
		});
	}
	
	
	fc.route(req, res);
	//res.end();
}

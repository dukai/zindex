//import modules
var url = require('url');
var stringUtils = require('./utils/string');
var fs = require('fs');
var debug = require('./utils/debug').debug;

var customRoutes = null;
var controllerName = 'index';
var actionName = 'index';
var params = {};



var mix = function(firstObj, secondObj){
	for(var i in firstObj){
		secondObj[i] = firstObj[i];
	}
	
	return secondObj;
}

//parse url, get controller name , action name and others
var parseUrl = function(urlStr){
	var urlEntity = url.parse(urlStr, true);
	var pathname = urlEntity.pathname;
	var query = urlEntity.query;
	pathname = stringUtils.trim(pathname, '/');
	if(pathname == ''){
		controllerName = 'index';
		actionName = 'index';
	}else{
		var requestParams = pathname.split('/');
		controllerName = requestParams.length == 0 ? 'index' : requestParams.shift();
		actionName = requestParams.length == 0 ? 'index' : requestParams.shift();
		while(requestParams.length > 0){
			var key = requestParams.shift();
			var value = requestParams.shift();
			params[key] = value ? value : '';
		}
	}
	
	params = mix(params, query);
	
}

exports.setRouteConfig = function(routeConfig){
	customRoutes = routeConfig;
};

exports.route = function(req, res){
	parseUrl(req.url);
	var controllerPath = APP_PATH + '/controllers/' + stringUtils.dashToUnderScore(controllerName) + '_controller.js';
	
	fs.exists(controllerPath, function(exists){
	
		if(exists){
			//存在
			//res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			//res.end("Controller Found!");
			var controller = require(controllerPath).newInstance({request: req, response: res, controllerName: controllerName, actionName: actionName, params: params});;
			controller.run();
			
		}else{
			//不存在
			res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Controller NOT Found!");
		}
	});
};


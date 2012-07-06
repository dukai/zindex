//import modules
var url = require('url');
var util = require('util');
var stringUtils = require('./utils/string');
var path = require('path');

var customRoutes = null;
var controllerName = 'index';
var actionName = 'index';
var params = {};

var debug = function(obj){
	console.log(util.inspect(obj));
};

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
	var requestParams = stringUtils.trim(pathname, '/').split('/');
	
	
	controllerName = requestParams.length == 0 ? 'index' : requestParams.shift();
	actionName = requestParams.length == 0 ? 'index' : requestParams.shift();
	
	while(requestParams.length > 0){
		var key = requestParams.shift();
		var value = requestParams.shift();
		params[key] = value ? value : '';
	}
	
	params = mix(params, query);
	
	//debug(params);
	//debug('Controller: ' + stringUtils.dashToUnderScore(controllerName) + ' Action: ' + actionName)
}

exports.setRouteConfig = function(routeConfig){
	customRoutes = routeConfig;
};

exports.route = function(req, res){
	parseUrl(req.url);
	var controllerPath = APP_PATH + '/controllers/' + stringUtils.dashToUnderScore(controllerName) + '_controller.js';
	
	path.exists(controllerPath, function(exists){
	
		console.log(exists);
		if(exists){
			//存在
			res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Controller Found!");
		}else{
			//不存在
			console.log("FALSE");
			res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("Controller NOT Found!");
		}
	});
};

//import modules
var url = require('url');
var stringUtils = require('./utils/string');
var fs = require('fs');
var path = require('path');
var config = require('../config');
var route = require('./route');
var Intent = require('./intent');

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

var isStaticFile = function(url, callback){
	var filepath = FILE_PATH + url;
	fs.stat(filepath, function(err, stats){
		var isFile = false;
		if(!err && stats.isFile()){
			isFile = true;
		}
		callback(isFile, stats);
	});
};

exports.setRouteConfig = function(routeConfig){
	customRoutes = routeConfig;
};

exports.route = function(req, res){
	isStaticFile(req.url, function(isFile, stats){
		if(isFile){
			var extname = path.extname(req.url);
			extname = stringUtils.trim(extname, '\\.');
			var mimeTypes = require('./MIME').types;
			res.writeHead(200, {'Content-Type': mimeTypes[extname]});
			res.end(fs.readFileSync(FILE_PATH + req.url, 'binary'), 'binary');
		}else{
			route.addRoutes(config.routes);
			var routeResult = route.parseURL(req.url);
			if(!routeResult){
				res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
				res.end("<h1>Controller NOT Found!</h1><hr />Powered by dk");
				return;
			}
			var controllerPath = config.app_path + '/controllers/' + stringUtils.dashToUnderScore(routeResult.getController()) + '_controller.js';
			fs.exists(controllerPath, function(exists){
				if(exists){
					//存在
					var intent = new Intent({
						request: req,
						response: res,
						controllerName: routeResult.getController(),
						actionName: routeResult.getAction(),
						params: routeResult._params
					});
					var RefController = require(controllerPath)
					new RefController({
						request: req,
						response: res,
						controllerName: routeResult.getController(),
						actionName: routeResult.getAction(),
						params: routeResult._params
					}).run();

				}else{
					//不存在
					res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
					res.end("<h1>Controller NOT Found!</h1><hr />Powered by dk");
				}
			});
		}
	});
	
};


var stringUtil = require('./utils/string'),
	url = require('url'),
	oo = require('./utils/oo');
var routesList = [];

var Route = function(config){
	this._initRoute(config);
}

Route.prototype = {
	_initRoute:function(config){
		this._url = stringUtil.trim(config.url, Route.URL_DELIMITER);
		this._controller = config.controller || 'index';
		this._action = config.action || 'index';
		this._module = config.module || 'default';
		this._parts = [];
		this._variables = [];
		this._params = {};
		var routePieces = this._url.split(Route.URL_DELIMITER);
		this._length = routePieces.length;

		for(var i = 0, len = routePieces.length; i < len; i++){
			var result = routePieces[i].match(Route.URL_VARIABLE);
			if(result){
				this._parts[i] = null;
				this._variables[i] = result[1];
			}else{
				this._parts[i] = routePieces[i];
			}
		}
	},


	match: function(path){
		path = stringUtil.trim(path, Route.URL_DELIMITER);
		var pathPieces = path.split(Route.URL_DELIMITER);
		if(pathPieces.length < this._length){
			//return false;
		}
		for(var i = 0, len = pathPieces.length; i < len; i++){
			var key = this._variables[i] ? this._variables[i] : null;
			var pathPart = decodeURIComponent(pathPieces[i]);
			if(key === null && pathPart != this._parts[i]){
				return false;
			}

			if(key != null){
				this._params[key] = pathPart;
				if(key == 'controller' || key == 'action' || key == 'module'){
					if(!!pathPart){
						this['_' + key] = pathPart;
					}

				}
			}
		}

		return true;
	},

	getController: function(){
		return this._controller;
	},

	getAction: function(){
		return this._action;
	}
}

Route.URL_VARIABLE = /{(\w+)}/;
Route.URL_DELIMITER = "/";

exports.Route = Route;

exports.addRoutes = function(configs){
	for(var i = 0, len = configs.length; i < len; i++){
		routesList.push(new Route(configs[i]));
	}

	routesList.push(new Route({
		url: '/{controller}/{action}',
		module: 'api',
		controller: 'index',
		action: 'index'
	}));
}

var match = function(path){
	for(var i = 0, len = routesList.length; i < len; i++){
		if(routesList[i].match(path)){
			return routesList[i];
		}
	}

	return false;
}

exports.parseURL = function(urlStr){
	var urlEntity = url.parse(urlStr, true);
	var pathName = urlEntity.pathname;
	var query = urlEntity.query;

	var routeResult = match(pathName);
	routeResult._params = oo.mix(routeResult._params, query);
	return routeResult;
}
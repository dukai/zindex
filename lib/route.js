var stringUtil = require('./utils/string');

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
		this.hashTalbe = {};
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
			return false;
		}

		for(var i = 0, len = pathPieces.length; i < len; i++){
			var key = this._variables[i] ? this._variables[i] : null;
			var pathPart = decodeURIComponent(pathPieces[i]);
			if(key === null && pathPart != this._parts[i]){
				return false;
			}

			if(key != null){
				this.hashTalbe[key] = pathPart;
			}
		}

		return true;
	}
}

Route.URL_VARIABLE = /{(\w+)}/;
Route.URL_DELIMITER = "/";
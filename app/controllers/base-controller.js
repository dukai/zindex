var AbstractController = require('mvc/lib/abstract_controller'),
	oo = require('mvc/lib/utils/oo');
var util = require('util');

var BaseController = function(intent){
	this._initBaseController(intent);
};

BaseController.prototype = {
	_initBaseController: function(intent){
		AbstractController.call(this, intent);

	},

	_init: function(){
		BaseController.parent._init.call(this);
		console.log('init base controller');
	},

	_getHeader: function(key){
		if(this.request.headers[key]){
			return this.request[key];
		}else{
			return null;
		}
	},

	_getAPIKey: function(){
		return this._getHeader('U-ApiKey');
	},

	_getMethod: function(){
		var method = this.request.method.toLowerCase();
		if(this.getParam('method', '') !== ''){
			method = this.getParam('method', '');
		}

		return method;
	}
}

oo.extend(BaseController, AbstractController);

module.exports = BaseController;
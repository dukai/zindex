var AbstractController = require('mvc/lib/abstract_controller'),
	oo = require('mvc/lib/utils/oo'),
    util = require('util'),
    User = require('../models/user');

var BaseController = function(intent){
	this._initBaseController(intent);
};

BaseController.prototype = {
	_initBaseController: function(intent){
		AbstractController.call(this, intent);
	},
	_init: function(dispatchActionCallback){
        var self = this;
        var user = new User();
        user.existsByAPIKey(this._getAPIKey(), function(status, row){
            if(!status){
                self.response.writeHead(403);
                self.response.end("U-ApiKey Incorrect")
            }else{
                self.member = row;
                dispatchActionCallback(true);
            }
        });
	},
	_getHeader: function(key){
        key = key.toLowerCase();
		if(this.request.headers[key]){
			return this.request.headers[key];
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
	},
	/**
	 * 未定义操作
	 * @private
	 */
	_undefinedAction:function(){
		var self = this;
		self.response.writeHead(405, {});
		self.response.end('Undefined Action');
	}
}

oo.extend(BaseController, AbstractController);

module.exports = BaseController;
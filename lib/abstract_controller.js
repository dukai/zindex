var debug = require('./utils/debug').debug;
var stringTools = require('./utils/string');
var View = require('./view').View;


var AbstractController = function(intent){
	this._initAbstractController(intent);
};

AbstractController.prototype = {
	_initAbstractController: function(intent){
		this.renderScriptStatus = true;
		this.request = intent.request;
		this.response = intent.response;
		this.params = intent.params;
		this.controllerName = intent.controllerName;
		this.actionName = stringTools.dashToCamel(intent.actionName) + 'Action';
		this.view = new View(intent);
	},
	run: function(){
		if(this[this.actionName]){
			this[this.actionName]();
			this.renderScriptStatus && this.render();
		}else{
			res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
			res.end("<h1>Controller NOT Found!</h1><hr />Powered by dk");
		}
	},
	render: function (){
		var self = this;
		this.view.renderScript(function(viewContent){
			self.response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			self.response.end(viewContent);
		});
	},

	json: function(content){
		this.response.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'})
		this.response.end(content);
	},

	setNoRender: function(){
		this.renderScriptStatus = false;
	}
};

module.exports = AbstractController;

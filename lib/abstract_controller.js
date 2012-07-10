var debug = require('./utils/debug').debug;
var stringTools = require('./utils/string');
var View = require('./view').View;


var AbstractController = function(simpleRequest){
	this.request = simpleRequest.request;
	this.response = simpleRequest.response;
	this.params = simpleRequest.params;
	this.controllerName = simpleRequest.controllerName;
	this.actionName = stringTools.dashToCamel(simpleRequest.actionName) + 'Action';
	this.view = new View(simpleRequest);
};

AbstractController.prototype = {
	run: function(){
		if(this[this.actionName]){
			this[this.actionName]();
			this.render();
		}else{
			console.log('undefined action name');
		}
	},
	render: function (){
		var self = this;
		this.view.renderScript(function(viewContent){
			self.response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
			self.response.end(viewContent);
		});
	}
};

exports.AbstractController = AbstractController;

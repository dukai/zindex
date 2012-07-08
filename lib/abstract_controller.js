var debug = require('./utils/debug').debug;
var stringTools = require('./utils/string');
var View = require('./view').View;


var AbstractController = function(simpleRequest){
	this.req = simpleRequest.request;
	this.res = simpleRequest.response;
	this.params = simpleRequest.params;
	this.controllerName = simpleRequest.controllerName;
	this.actionName = stringTools.dashToCamel(simpleRequest.actionName) + 'Action';
	this.view = new View(simpleRequest);
	this.bindData = null;
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
	bind: function(data){
		this.bindData = data;      
	},
	getBindData: function(){
		if(this.bindData){
			return this.bindData;
		}else{
			return {};
		}
	},
	render: function (){
		this.view.renderScript(this.getBindData());	
	}
};

exports.AbstractController = AbstractController;

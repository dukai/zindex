var Intent = function(options){
	this.request = options.request;
	this.response= options.request;
	this.controllerName= options.controllerName;
	this.actionName= options.actionName;
	this.params= options.params;
}

module.exports = Intent;
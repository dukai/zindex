var View = function(simpleRequest){
	this.simpleRequest = simpleRequest;	
};

View.prototype = {
	renderScript: function(bindData){
		var path = APP_PATH + '/views/' + this.simpleRequest.controllerName + '/' + this.simpleRequest.actionName + '.nhtml';
		var tmpl = require('./template').tmpl(path);
		var body = tmpl.render(bindData);
		this.simpleRequest.response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
		this.simpleRequest.response.end(body);
	}
};

exports.View = View;

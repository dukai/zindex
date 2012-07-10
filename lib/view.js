var Template = require('./template_v2').Template;

var View = function(simpleRequest){
	this.simpleRequest = simpleRequest;
	this.template = null;
};

View.prototype = {
	renderScript: function(){
		var self = this;
		var path = APP_PATH + '/views/' + this.simpleRequest.controllerName + '/' + this.simpleRequest.actionName + '.nhtml';
		var fs = require('fs');
		fs.readFile(path, 'utf8', function(err, viewFileContent){
			if(err){
				throw err;
			}else{
				self.template = new Template(viewFileContent);
				
				var body = self.template.render(self);
				self.simpleRequest.response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
				self.simpleRequest.response.end(body);
			}
		});
		
	}
};

exports.View = View;

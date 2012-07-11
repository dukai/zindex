var config = require('../config').template;
var fs = require('fs');

var viewFileContentCache = {};
var templateCache = {};

var Template = require('./template_v2').Template;
var View = function(simpleRequest){
	this.simpleRequest = simpleRequest;
	this.template = null;
};

View.prototype = {
	renderScript: function(callback){
		var self = this;
		
		var templateId = this.simpleRequest.controllerName + '_' + this.simpleRequest.actionName;
		if(config.isCache && templateCache[templateId]){
			//TODO: return cache
			this.template = templateCache[templateId];
			self.buildTemplate(callback);
		}else{
			var filename = this.getViewFilename();
			fs.readFile(filename, 'utf8', function(err, viewFileContent){
				if(err){
					throw err;
				}else{
					self.template = new Template(viewFileContent);
					config.isCache && (templateCache[templateId] = self.template);
					self.buildTemplate(callback);
				}
			});
		}
		
	},
	
	getViewFilename: function(){
		return APP_PATH + '/views/' + this.simpleRequest.controllerName + '/' + this.simpleRequest.actionName + '.nhtml';
	},
	
	buildTemplate: function(callback){
		var body = this.template.render(this);
		callback(body);
	},
	
	partial: function(filename){
		var templateId = filename;
		var filename = APP_PATH + '/views/' + filename;
		if(config.isCache && templateCache[templateId]){
			return templateCache[templateId].render({});
		}else{
			if(fs.existsSync(filename)){
				var viewFileContent = fs.readFileSync(filename);
				templateCache[templateId] = new Template(viewFileContent);
				return templateCache[templateId].render({});
			}
		}
	}
};

exports.View = View;

var config = require('../config').template;
var fs = require('fs');

var viewFileContentCache = {};

var Template = require('./template_v2').Template;
var View = function(simpleRequest){
	this.simpleRequest = simpleRequest;
	this.template = null;
};

View.prototype = {
	renderScript: function(callback){
		var self = this;
		
		var templateId = this.simpleRequest.controllerName + '_' + this.simpleRequest.actionName;
		if(config.isCache && viewFileContentCache[templateId]){
			//TODO: return cache
			self.buildTemplate(viewFileContentCache[templateId], callback);
		}else{
			var filename = this.getViewFilename();
			fs.readFile(filename, 'utf8', function(err, viewFileContent){
				if(err){
					throw err;
				}else{
					config.isCache && (viewFileContentCache[templateId] = viewFileContent);
					self.buildTemplate(viewFileContent, callback);
				}
			});
		}
		
	},
	
	getViewFilename: function(){
		return APP_PATH + '/views/' + this.simpleRequest.controllerName + '/' + this.simpleRequest.actionName + '.nhtml';
	},
	
	buildTemplate: function(content, callback){
		this.template = new Template(content);
		var body = this.template.render(this);
		
		callback(body);
	},
	
	partial: function(filename){
		return filename;
	}
};

exports.View = View;

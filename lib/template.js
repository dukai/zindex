var cache = {};
exports.tmpl = function(str){
	var fs = require('fs');
	if(!fs.existsSync(str)){
		throw "undefinde view file";
	}
	var config = require('../config').template;
	var content;
	if(config.isCache){
		content = cache[str] ? cache[str] : (cache[str] = fs.readFileSync(str, 'utf8'));
	}else{
		content = fs.readFileSync(str, 'utf8');
	}
	
	//var content = !/\s|<|>/.test(str) ? cache[str] = cache[str] || fs.readFileSync(str, 'utf8') : str;
	content = content.replace(/\\/g, '\\\\')
				.replace(/([\r\t\n])/g, " ")
				.split("<?").join("\t")
				.replace(/((^|\?>)[^\t]*)'/g, "$1\r")
				.replace(/(')/g, '\\$1')
				.replace(/\t=(.*?)\?>/g, "',$1,'")
				.split("\t").join("');")
				.split("?>").join("___tp.push('")
				.split("\r").join("\\'");
	return {
		render: function(data){
			var actualParams = [], formalParams = [];
			for(var key in data){
				formalParams.push(key);
				actualParams.push(data[key]);
			}
			return new Function(formalParams, "var ___tp = [], print = function(){___tp.push.apply(___tp,arguments);};___tp.push('" + content + "');return ___tp;").apply(null, actualParams).join("");
		}
	};
};

var cache = {};
var debug = true;


var Template = function(tmplContent){
	var OPEN_TAG = '<?';
	var CLOSE_TAG = '?>';
	
	//预处理模板内容
	tmplContent = tmplContent.replace(/('|"|\\)/g, "\\$1")
		.replace(/\r/g, "\\r")
		.replace(/\t/g, "\\t")
		.replace(/\n/g, "\\n");
	
	//分析模板语法
	tmplContent = tmplContent.split(OPEN_TAG).join('\t')
		.replace(/\t=(.*?)\?>/g, function(){
			var target =  arguments[1].replace(/\\t/g, ' ').replace(/\\n/g, '\n').replace(/\\r/, '\r');
			return "' + " + target + ";\r\n___tpContent += '";
		})
		.replace(/\t(.*?)\?>/g, function(){
			var target = arguments[1].replace(/\\t/g, ' ').replace(/\\n/g, '\n').replace(/\\r/, '\r');
			return "';\r\n" + target + "\r\n___tpContent += '";
		});
	
	var fnBody = "var ___tpContent = '',\
	print = function(){\
		___tpContent += [].join.call(arguments, '');\
	};\
	___tpContent += '" + tmplContent + "';\
	return ___tpContent;";
	
	//渲染
	this.render = function(target){
		return new Function(fnBody).call(target);
	};
};

exports.Template = Template;
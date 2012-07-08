var util = require('util');

exports.debug = function(obj){
	console.log(util.inspect(obj));
};
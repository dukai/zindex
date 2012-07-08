var AbstractController = require('../../lib/abstract_controller').AbstractController;
var debug = require('../../lib/utils/debug').debug;
var util = require('util');

var IndexController = function(simpleRequest){

	AbstractController.call(this, simpleRequest);
}

util.inherits(IndexController, AbstractController);

IndexController.prototype.indexAction = function(){
	console.log('index/index');
}

exports.newInstance = function(simpleRequest){
	return new IndexController(simpleRequest);
}

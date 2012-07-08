var AbstractController = require('../../lib/abstract_controller').AbstractController;
var debug = require('../../lib/utils/debug').debug;
var util = require('util');

var IndexController = function(simpleRequest){

	AbstractController.call(this, simpleRequest);
}

util.inherits(IndexController, AbstractController);

IndexController.prototype.indexAction = function(){
	
	this.bind({
		username: '杜凯',
		age: '26',
		sex: '男'
	});
}

exports.newInstance = function(simpleRequest){
	return new IndexController(simpleRequest);
}

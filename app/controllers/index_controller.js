var AbstractController = require('../../lib/abstract_controller').AbstractController;
var debug = require('../../lib/utils/debug').debug;
var util = require('util');

var IndexController = function(simpleRequest){
	AbstractController.call(this, simpleRequest);
	
}

util.inherits(IndexController, AbstractController);

IndexController.prototype.indexAction = function(){
	this.view.username =  '杜凯',
	this.view.age = '26',
	this.view.sex = '男'
}

exports.newInstance = function(simpleRequest){
	return new IndexController(simpleRequest);
}

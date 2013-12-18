var BaseController = require('./base_controller'),
	oo = require('mvc/lib/utils/oo');
var util = require('util');

var SensorController = function(intent){
	this._initSensorController(intent);
};

SensorController.prototype = {
	_initSensorController: function(intent){
		BaseController.call(this, intent);
	},

	indexAction: function(){

	},

	singleAction: function(){

	},

	historyDataAction: function(){

	}

}

oo.extend(SensorController, BaseController);

module.exports = SensorController;
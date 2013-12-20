var BaseController = require('./base_controller'),
	oo = require('mvc/lib/utils/oo'),
	Sensor = require('../models/sensor');
var util = require('util');

var SensorDataController = function(intent){
	this._initSensorDataController(intent);
};

SensorDataController.prototype = {
	_initSensorDataController: function(intent){
		BaseController.call(this, intent);
	}
};
oo.extend(SensorDataController, BaseController);

module.exports = SensorDataController;
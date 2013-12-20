var BaseController = require('./base_controller'),
	oo = require('mvc/lib/utils/oo');
var util = require('util');

var SensorDataController = function(intent){
	this._initSensorDataController(intent);
};

SensorDataController.prototype = {
	_initSensorDataController: function(intent){
		BaseController.call(this, intent);
	},

    indexAction: function(){
        this.setNoRender();
        this.json("HELLO");
    }
};
oo.extend(SensorDataController, BaseController);

module.exports = SensorDataController;
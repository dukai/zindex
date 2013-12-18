var BaseController = require('./base_controller'),
	oo = require('mvc/lib/utils/oo'),
    Sensor = require('../models/sensor');
var util = require('util');

var SensorController = function(intent){
	this._initSensorController(intent);
};

SensorController.prototype = {
	_initSensorController: function(intent){
		BaseController.call(this, intent);
	},

	indexAction: function(){
        this.setNoRender();

        var self = this;
        var deviceId = parseInt(this.getParam('device_id', 0));
        switch (this._getMethod()){
            case 'get':
                this._listSensor(deviceId);
                break;
            case 'post':
                this._createSensor(deviceId);
                break;
            default :
                this._undefinedAction();
                break;
        }
	},

	singleAction: function(){

	},

	historyDataAction: function(){

	},


    _createSensor: function(deviceId){
        
    },

    _listSensor: function(deviceId){

    }


}

oo.extend(SensorController, BaseController);

module.exports = SensorController;
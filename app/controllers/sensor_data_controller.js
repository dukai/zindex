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

    _init: function(dispatchActionCallback){
        this.setNoRender();
        SensorDataController.parent._init.call(this, function(status){
            dispatchActionCallback(true);
        });
    },

    indexAction: function(){
        this.json("HELLO");
    },

    datapointsAction: function(){
        this.json({title: 'helle'});
    }
};
oo.extend(SensorDataController, BaseController);

module.exports = SensorDataController;
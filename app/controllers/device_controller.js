var AbstractController = require('../../lib/abstract_controller'),
	oo = require('../../lib/utils/oo');
var debug = require('../../lib/utils/debug').debug;
var util = require('util');

var DeviceController = function(intent){
	this._initDeviceController(intent);
};

DeviceController.prototype = {
	_initDeviceController: function(intent){
		AbstractController.call(this, intent);
	},

	indexAction: function(){
		this.view.username =  '杜凯',
		this.view.age = '26',
		this.view.sex = '男'

		var devices = {
			title: 'first device',
			sensor_count: 6,
			author: 'dk'
		};

		var result = JSON.stringify(devices);

		this.json(result);
	}
}

oo.extend(DeviceController, AbstractController);

module.exports = DeviceController;
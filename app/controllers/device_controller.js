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
		this.setNoRender();
		var self = this;
		this.view.username =  '杜凯',
		this.view.age = '26',
		this.view.sex = '男'

		var devices = {
			title: 'first device',
			sensor_count: 6,
			author: 'dk'
		};

		var result = JSON.stringify(devices);

		var mysql      = require('mysql');
		var connection = mysql.createConnection({
			host     : 'localhost',
			user     : 'root',
			password : 'yeelink',
			database: 'yeelink'
		});

		connection.connect();

		connection.query('select * from yl_devices', function(err, rows, fields) {
			self.json(JSON.stringify(rows));
		});

		connection.end();


	}
}

oo.extend(DeviceController, AbstractController);

module.exports = DeviceController;
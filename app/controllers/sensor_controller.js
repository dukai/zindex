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
		this._checkPermission(deviceId, function(){
			switch (self._getMethod()){
				case 'get':
					self._listSensor(deviceId);
					break;
				case 'post':
					self._createSensor(deviceId);
					break;
				default :
					self._undefinedAction();
					break;
			}
		});

	},

	singleAction: function(){
		var self = this;
		this.setNoRender();
		var deviceId = this.getParam('device_id', 0);
		var sensorId = parseInt(this.getParam('sensor_id', 0));

		this._checkPermission(deviceId, sensorId, function(){
			switch (self._getMethod()){
				case 'get':
					self._viewSensor(deviceId, sensorId);
					break;
				case 'put':
					self._editDevice(deviceId);
					break;
				case 'delete':
					self._deleteDevice(deviceId);
					break;
				default :
					self._undefinedAction();
					break;
			}
		});
	},

	historyDataAction: function(){

	},

	/**
	 * 检查设备ID与用户信息是否相符
	 * @param deviceId
	 * @param sensorId
	 * @param callback
	 * @private
	 */
	_checkPermission: function(deviceId, sensorId, callback){
		var self = this;
		var db = this.getDb();
		var sql = '';
		if(arguments.length == 2){
			callback = sensorId;
			sql = "select count(*) as count from yl_devices where user_login='" + this.member.user_login + "' and id=" + deviceId ;
		}else{
			sql = "select count(*) as count from yl_sensors where user_login='" + this.member.user_login + "' and device_id=" + deviceId + " and id=" + sensorId;
		}
		db.fetchRow(sql, function(err, rows) {
			if(rows.count > 0){
				callback();
			}else{
				self.json("API Key And Device Id Not Match");
			}
		});

	},
	/**
	 * 创建设备
	 * @param deviceId
	 * @private
	 */
    _createSensor: function(deviceId){
	    var self = this;
	    var db = this.getDb();


	    this.getRawPost(function(err, data){
		    try{
			    var data = JSON.parse(data);


			    if(!data.type || SensorController.SENSOR_DATA_TYPE[data.type] === undefined || SensorController.SENSOR_TYPE[data.type] === undefined){
				    self.statusCode = 406;
				    self.json("Fail to create sensor,please check the data format.");
				    return;
			    }

			    var sensor = {
				    'user_login': self.member.user_login,
				    'device_id': deviceId,
				    sensor_manufacturer: 1,
				    'sensor_title':data.title,
				    'sensor_about':data['about'],
				    'sensor_tags':data['tags'].join(','),
				    'sensor_data_type':SensorController.SENSOR_DATA_TYPE[data.type],
				    'sensor_type':SensorController.SENSOR_TYPE[data.type],
				    'sensor_last_update':0,
				    'sensor_last_event':0,
				    'sensor_status':1
			    };

			    if(data.type == 'value'){
				    sensor.sensor_unit = data.unit.name;
				    sensor.sensor_unit_symbol = data.unit.symbol;
				    sensor.sensor_last_data = 0;
			    }
			    db.insert('yl_sensors', sensor, function(err, result) {
				    console.log(err);
				    var insertId = result.insertId;
				    var updateSql = "update yl_devices set sensor_amount=sensor_amount+1 where id=" + deviceId;
				    db.query(updateSql, function(err, result){
					    self.json(JSON.stringify(insertId));
				    });
			    });

		    }catch (e){
			    self.json(JSON.stringify('JSON字符串内容不规范'));
		    }


	    });
    },
	/**
	 * 设备列表
	 * @param deviceId
	 * @private
	 */
    _listSensor: function(deviceId){
	    var self = this;
	    var sql = "select * from yl_sensors where device_id=" + deviceId + " limit 20";
		this.getDb().fetchAll(sql, function(err, rows){
			var result = [];
			for(var i = 0, len = rows.length; i < len; i++){
				var r = rows[i];
				var sensor = {
					id: r.id,
					title: r.sensor_title,
					about: r.sensor_about,
					type: r.sensor_type,
					last_update: r.sensor_last_update,
					last_data: r.sensor_last_data,
					last_data_gen: r.sensor_last_data_gen
				};

				result.push(sensor);
			}

			self.json(JSON.stringify(result));
		});
    },

	_viewSensor: function(deviceId, sensorId){
		var self = this;
		var sql = "select * from yl_sensors where id=" + sensorId;
		this.getDb().fetchRow(sql, function(err, row){
			self.json(JSON.stringify(row));
		});
	}

};

SensorController.SENSOR_DATA_TYPE = {
	value: Sensor.DataType.VALUE,
	gps: Sensor.DataType.GEN,
	gen: Sensor.DataType.GEN,
	photo: Sensor.DataType.BIN
};

SensorController.SENSOR_TYPE = {
	value: Sensor.Type.DATA,
	gps: Sensor.Type.GPS,
	gen: Sensor.Type.GEN,
	photo: Sensor.Type.PHOTO
};

oo.extend(SensorController, BaseController);

module.exports = SensorController;
var BaseController = require('./base_controller'),
	oo = require('mvc/lib/utils/oo'),
	Device = require('../models/device'),
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

		this._checkPermission(deviceId, sensorId, function(sensor){
			switch (self._getMethod()){
				case 'get':
					self._viewSensor(sensor);
					break;
				case 'put':
					self._editSensor(sensorId);
					break;
				case 'delete':
					self._deleteSensor(deviceId, sensorId, sensor.sensor_type);
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
		if(arguments.length == 2){
			callback = sensorId;

			Device.exists(this.member.user_login, deviceId, function(row){
				if(row){
					callback(row);
				}else{
					self.exit(Device.ERR_MESSAGE.API_KEY_DEVICE_NOT_MATCH, 406);
				}

			})
		}else{
			Sensor.exists(this.member.user_login, deviceId, sensorId, function(row){
				if(row){
					callback(row);
				}else{
					self.exit(Sensor.ERR_MESSAGE.API_KEY_DEVICE_SENSOR_NOT_MATCH, 406);
				}
			});
		}

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
			    if(!data.type){
				    data.type = 'value';
			    }

			    if( SensorController.SENSOR_DATA_TYPE[data.type] === undefined || SensorController.SENSOR_TYPE[data.type] === undefined){
				    self.exit("Fail to create sensor,please check the data format.", 406);
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
					    self.json(insertId);
				    });
			    });

		    }catch (e){
                self.statusCode = 406;
			    self.json('JSON字符串内容不规范');
			    console.log(e);
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

                if(r.sensor_type == Sensor.Type.VALUE){
                    sensor.unit_name = r.sensor_unit;
                    sensor.unit_symbol = r.sensor_unit_symbol;
                }

				result.push(sensor);
			}

			self.json(result);
		});
    },
    /**
     * 查看传感器信息
     * @param sensor
     * @private
     */
	_viewSensor: function(sensor){
        var sensorResult = {
            id: sensor.id,
            title: sensor.sensor_title,
            about: sensor.sensor_about,
            type: sensor.sensor_type,
            last_update: sensor.sensor_last_update
        };

        if(sensor.sensor_type == Sensor.Type.VALUE){
	        sensorResult.unit_name = sensor.sensor_unit;
	        sensorResult.unit_symbol = sensor.sensor_unit_symbol;
	        sensorResult.last_data = sensor.sensor_last_data;
        }
		this.json(sensorResult);
	},
    /**
     * 编辑传感器信息
     * @param sensorId
     * @private
     */
    _editSensor: function(sensorId){
        var self = this;
        var db = this.getDb();
        this.getRawPost(function(err, data){
            try{
                var data = JSON.parse(data);
                var sensor = {
                };

                if(data.title){
                    sensor.sensor_title = data.title;
                }

                if(data.about){
                    sensor.sensor_about = data.about;
                }
                if(data.tags){
                    sensor.sensor_tags = data['tags'].join(',');
                }

                if(data.unit && data.unit.name){
                    sensor.sensor_unit = data.unit.name;
                }

                if(data.unit && data.unit.symbol){
                    sensor.sensor_unit_symbol = data.unit.symbol;
                }

                db.update('yl_sensors', sensor, {id: sensorId}, function(err, result) {
                    self.json(1);
                });

            }catch (e){
                self.statusCode = 406;
                self.json('JSON字符串内容不规范');
            }


        });
    },
    /**
     * 删除传感器信息
     * @param deviceId
     * @param sensorId
     * * @param sensorType
     * @private
     */
    _deleteSensor: function(deviceId, sensorId, sensorType){
        var self = this;
        var sql = "delete from yl_sensors where id=" + sensorId;
	    var updateDeviceSql = "update yl_devices set sensor_amount=sensor_amount-1 where id='" + deviceId + "' and sensor_amount > 0";
	    var deleteTriggerSql = "DELETE FROM yl_triggers WHERE sensor_id ="  + sensorId;

        var db = this.getDb();

        db.query(sql, function(err, row){

	        db.query(updateDeviceSql, function(err, result){
		        self.json(1);
		        db.query(deleteTriggerSql, function(err, result){
			        self._deleteData(sensorId, sensorType);
		        });
	        });

        });
    },

	_deleteData: function(sensorId, sensorType){

		//TODO: 完善数据删除部分内容
		//数值型
		if(sensorType == Sensor.Type.VALUE || sensorType == Sensor.Type.SWITCHER){
			var deleteDataSql = "delete from yl_sensor_data where sensorId=" + sensorId;
			this.getDb().query(deleteDataSql);
		}
		//泛型
		if(sensorType == Sensor.Type.GEN || sensorType == Sensor.Type.GPS){
			var deleteDataSql = "delete from yl_sensor_data_gen where sensorId=" + sensorId;
			this.getDb().query(deleteDataSql);
		}
		//图片型
		if(sensorType == Sensor.Type.PHOTO){
			
		}
	}

};

SensorController.SENSOR_DATA_TYPE = {
	value: Sensor.DataType.VALUE,
    switcher: Sensor.DataType.VALUE,
	gps: Sensor.DataType.GEN,
	gen: Sensor.DataType.GEN,
	photo: Sensor.DataType.BIN
};

SensorController.SENSOR_TYPE = {
	value: Sensor.Type.VALUE,
    switcher: Sensor.Type.SWITCHER,
	gps: Sensor.Type.GPS,
	gen: Sensor.Type.GEN,
	photo: Sensor.Type.PHOTO
};

oo.extend(SensorController, BaseController);

module.exports = SensorController;
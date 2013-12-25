var BaseController = require('./base_controller'),
	oo = require('mvc/lib/utils/oo'),
	Device = require('../models/device'),
	Sensor = require('../models/sensor'),
	SensorData = require('../models/sensor_data'),
	SensorDataHelper = require('../helpers/sensor_data_helper');

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
        var self = this;
        var deviceId = this.getParam('device_id', 0);
        var sensorId = parseInt(this.getParam('sensor_id', 0));

        this._checkPermission(deviceId, sensorId, function(sensor){
            switch (self._getMethod()){
                case 'post':
                    self._createDataPoint(sensorId, sensor);
                    break;
                case 'get':
                    self._listDataPoint(sensorId);
                    break;
                default :
                    self._undefinedAction();
                    break;
            }
        });
    },

    singlePointAction: function(){
        var self = this;
        var deviceId = this.getParam('device_id', 0);
        var sensorId = parseInt(this.getParam('sensor_id', 0));
        var dataKey = this.getParam('key', '');

        this._checkPermission(deviceId, sensorId, function(sensor){
            switch (self._getMethod()){
                case 'post':
                    self._undefinedAction();
                    break;
                case 'get':
                    self._getDataPoint(dataKey, sensor);
                    break;
                case 'delete':
                    self._undefinedAction();
                    break;
                default :
                    self._undefinedAction();
                    break;
            }
        });
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

    _createDataPoint: function(sensorId, sensor){
        var self = this;
        var db = this.getDb();
        var now = Math.round(new Date().getTime() / 1000);
	    var sensorLastUpdate = sensor.sensor_last_update;
        if(sensor.sensor_type == Sensor.Type.VALUE && now - sensorLastUpdate < 10){
            self.exit(SensorData.ERR_MESSAGE.REQUEST_INTERVAL_TOO_SHORT, 406);
            return;
        }

        this.getRawPost(function(err, data){
            try{
                var data = JSON.parse(data);
                if(data.constructor === Array){
                    //TODO: 添加单个设备数据点，需增加类型判断
                    var dataLength = data.length;
                    var successLength = 0;
	                for(var i in data){
		                self._addSingleDataPoint(data[i], sensor, function(result){
                            if(result.status){
                                successLength++;
                            }else{
                                console.log("add single data point:" + result);
                            }
                            dataLength --;
                            if(dataLength == 0){
                                self.exit(successLength.toString());
                            }
                        });
	                }
                }else if(data.constructor === Object){
	                self._addSingleDataPoint(data, sensor, function(result){
                        self.exit(result.message, result.statusCode);
                    });
                }

            }catch (e){
	            throw e;
                self.statusCode = 406;
                self.json('JSON字符串内容不规范');
            }
        });
    },

	_addSingleDataPoint: function(data, sensor, callback){
		var self = this;
		var now = Math.round(new Date().getTime() / 1000);
		switch (sensor.sensor_type){
			case Sensor.Type.VALUE:
				var result = SensorDataHelper.validValueSensorData(data);
				if(result.status){
					self._insertValueDataPoint(data, sensor, callback);
				}else{
					callback(result);
				}
				break;
			case Sensor.Type.SWITCHER:

				var result = SensorDataHelper.validSwitcherSensorData(data);
				if(result.status){
					self._insertSwitcherDataPoint(data, sensor, callback);
				}else{
					callback(result);
				}
				break;
			case Sensor.Type.GEN:
				break;
			case Sensor.Type.GPS:
				break;
			case Sensor.Type.PHOTO:
				break;
			case Sensor.Type.WEIBO:
				break;
		}
	},
    /**s
     * 插入数值型数据节点
     * @param data
     * @param sensor
     * @param callback
     * @private
     */
	_insertValueDataPoint: function(data, sensor, callback){
		var self = this;
		var insertData = {};
        var now = Math.round(new Date().getTime() / 1000);
		insertData.sensor_id = sensor.id;
		insertData.data_timestamp = !!data.timestamp ? Math.round(Date.parse(data.timestamp) / 1000) : now;
		insertData.data_value = parseFloat(data.value);
		insertData.data_create_time = now;
		insertData.sensor_status = 1;
		SensorData.insertValueData(insertData, function(err, result){
			if(!err){
                callback({
                    status: true,
                    statusCode: 200,
                    message: ""
                });
                Sensor.update(sensor.id, {sensor_last_update: now, sensor_last_data: insertData.data_value}, function(result){
                    console.log(result);
                });
                Device.updateLastUpdateTime(sensor.device_id, now, function(result){
                    console.log(result);
                });
			}else{
                callback({
                    status: false,
                    statusCode: 406,
                    message: err.code
                });
			}
		});
	},

	/**s
	 * 插入数值型数据节点
	 * @param data
	 * @param sensor
	 * @param callback
	 * @private
	 */
	_insertSwitcherDataPoint: function(data, sensor, callback){
		var self = this;
		var insertData = {};
		var now = Math.round(new Date().getTime() / 1000);
		insertData.sensor_id = sensor.id;
		insertData.data_timestamp = now;
		insertData.data_value = parseInt(data.value);
		insertData.data_create_time = now;
		insertData.sensor_status = 1;
		SensorData.insertValueData(insertData, function(err, result){
			if(!err){
				callback({
					status: true,
					statusCode: 200,
					message: ""
				});
				Sensor.updateLastUpdateTime(sensor.id, now, function(result){
					console.log(result);
				});
				Device.updateLastUpdateTime(sensor.device_id, now, function(result){
					console.log(result);
				});
			}else{
				callback({
					status: false,
					statusCode: 406,
					message: err.code
				});
			}
		});
	},

	_insertValueData: function(data, callback){

	},

    /**
     * 数据节点列表
     * @param sensorId
     * @private
     */
    _listDataPoint: function(sensorId){
        var self = this;
        var sql = "select * from yl_sensor_data where sensor_id=" + sensorId + " order by data_timestamp desc limit 10";
        this.getDb().fetchAll(sql, function(err, results){
            self.json(results);
        });
    },
    /**
     * 获取指定的数据点
     * @param dataKey
     * @param sensor
     * @private
     */
    _getDataPoint: function(dataKey, sensor){
        var self = this;
        var now = Math.round(new Date().getTime() / 1000);
        switch (sensor.sensor_type){
            case Sensor.Type.VALUE:

                if(dataKey == ''){
                    SensorData.getLastValueData(sensor.id, function(err, row){
                        !err && self.json(row);
                    });
                }else{
                    var timestamp = Date.parse(dataKey);
                    if(timestamp){
                        SensorData.getValueData(sensor.id, Math.round(timestamp/1000), function(err, row){
                            if(!err){
                                if(row){
                                    self.json(row);
                                }else{
                                    self.exit(SensorData.ERR_MESSAGE.KEY_INVALID, 406);
                                }
                            }else{
                                self.exit(err.code, 406);
                            }
                        });
                    }else{
                        self.exit(SensorData.ERR_MESSAGE.TIMESTAMP_FORMAT_INVALID, 406);
                    }

                }
                break;
            case Sensor.Type.SWITCHER:
                if(dataKey == ''){
                    SensorData.getLastValueData(sensor.id, function(err, row){
                        !err && self.json(row);
                    });
                }else{
                    var timestamp = Date.parse(dataKey);
                    if(timestamp){
                        SensorData.getValueData(sensor.id, Math.round(timestamp/1000), function(err, row){
                            if(!err){
                                if(row){
                                    self.json(row);
                                }else{
                                    self.exit(SensorData.ERR_MESSAGE.KEY_INVALID, 406);
                                }
                            }else{
                                self.exit(err.code, 406);
                            }
                        });
                    }else{
                        self.exit(SensorData.ERR_MESSAGE.TIMESTAMP_FORMAT_INVALID, 406);
                    }

                }
                break;
            case Sensor.Type.GEN:
                break;
            case Sensor.Type.GPS:
                break;
            case Sensor.Type.PHOTO:
                break;
            case Sensor.Type.WEIBO:
                break;
        }
    }
};
oo.extend(SensorDataController, BaseController);

module.exports = SensorDataController;
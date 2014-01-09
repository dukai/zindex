var BaseController = require('./base_controller'),
	oo = require('mvc/lib/utils/oo'),
	utils = require('mvc/lib/utils'),
	Device = require('../models/device'),
	Sensor = require('../models/sensor'),
	SensorData = require('../models/sensor_data'),
	SensorDataHelper = require('../helpers/sensor_data_helper'),
	imageinfo = require('imageinfo'),
	redis = require('redis'),
	redisClient = redis.createClient(6379, '192.168.0.46', {
		detect_buffers: true
	});

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
                    self._listDataPoint(sensorId, sensor);
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

    photoAction: function(){
        var self = this;
        var deviceId = this.getParam('device_id', 0);
        var sensorId = parseInt(this.getParam('sensor_id', 0));

        this._checkPermission(deviceId, sensorId, function(sensor){
            switch (self._getMethod()){
                case 'post':
                    self._addPhoto(sensor);
                    break;
                case 'get':
                    self._undefinedAction();
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

    _addPhoto: function(sensor){
	    var self = this;
        if(sensor.sensor_type !== Sensor.Type.PHOTO){
            this.exit(SensorData.ERR_MESSAGE.SENSOR_TYPE_INVALID, 406);
        }else{

            this.getRawPostBuffer(function(err, data){
                //var fs = require('fs');
                //var appPath = require('mvc/lib/config').app_path;
	            var info = imageinfo(data);
	            if(!info || info.type !== 'image' || (info.format !== 'PNG' && info.format !== 'JPG' && info.format !== 'GIF')){
		            self.exit(SensorData.ERR_MESSAGE.DATA_FORMAT_INVALID, 406);
		            return;
	            }
	            if(data.length / 1024 > SensorData.PHOTO_MAX_SIZE){
		            self.exit(SensorData.ERR_MESSAGE.PHOTO_SIZE_TOO_LARGE, 406);
		            return;
	            }


	            var now = Math.floor(new Date().getTime() / 1000);
	            var cacheKey = "sf:" + sensor.id + ":" + now + '.' + info.format.toLowerCase();
	            redisClient.rpush("sensor_photos_queue", cacheKey);
	            redisClient.set(cacheKey, data);
	            if(info.width > info.height){
		            info.sWidth = 100;
		            info.sHeight = parseInt(info.height * 100 / info.width);
	            }else{
		            info.sHeight = 100;
		            info.sWidth = parseInt(info.width * 100 / info.height);
	            }

	            var photoSize = Math.round(data.length / 1024);
	            var photoData = {
		            sensor_id: sensor.id,
		            photo_timestamp: now,
		            photo_size: photoSize,
		            photo_width: info.width,
		            photo_height: info.height,
		            photo_s_width: info.sWidth,
		            photo_s_height: info.sHeight,
		            photo_dir: '/foto-sensors.b0.upaiyun.com/' + sensor.id + '/',
		            photo_type: info.format.toLowerCase()
	            };
	            SensorData.insertPhotoData(photoData, function(err, result){
		            self.exit("OK", 200);
		            if(sensor.sensor_param == '' || !sensor.sensor_param){
			            SensorData.getPhotoSize(sensor.id, function(size){
				            size = size ? size: 0;
				            Sensor.update(sensor.id, {sensor_last_update: now, sensor_param: size}, function(result){
					            utils.debug(result);
				            });
			            });
		            }else{
			            Sensor.update(sensor.id, {sensor_last_update: now, sensor_param: parseInt(sensor.sensor_param) + photoSize}, function(result){
				            utils.debug(result);
			            });
		            }

		            Device.updateLastUpdateTime(sensor.device_id, now, function(result){
			            utils.debug(result);
		            });
	            });


            });
        }
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
	 * 创建数据节点
	 * @param sensorId
	 * @param sensor
	 * @private
	 */
    _createDataPoint: function(sensorId, sensor){
        var self = this;
        var db = this.getDb();
        var now = Math.round(new Date().getTime() / 1000);
	    var sensorLastUpdate = sensor.sensor_last_update;
		var sensorType = sensor.sensor_type;
        if((sensorType == Sensor.Type.VALUE || sensorType == Sensor.Type.GEN || sensorType == Sensor.Type.GPS || sensorType == Sensor.Type.PHOTO) && now - sensorLastUpdate < 10){
            self.exit(SensorData.ERR_MESSAGE.REQUEST_INTERVAL_TOO_SHORT, 406);
            return;
        }

        this.getRawPost(function(err, data){
            try{
                var data = JSON.parse(data);
                if(data.constructor === Array){
	                //添加多个数据点
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
	                //添加单个数据点
	                self._addSingleDataPoint(data, sensor, function(result){
                        self.exit(result.message, result.statusCode);
                    });
                }

            }catch (e){
	            require('mvc/utils').debug(e, "ERR");
	            self.exit('JSON字符串内容不规范', 406);
            }
        });
    },
	/**
	 * 添加单个数据点
	 * @param data
	 * @param sensor
	 * @param callback
	 * @private
	 */
	_addSingleDataPoint: function(data, sensor, callback){
		var self = this;
		var now = Math.round(new Date().getTime() / 1000);
		switch (sensor.sensor_type){
			case Sensor.Type.VALUE:
				var result = SensorDataHelper.validValueSensorData(data);
				if(result.status){
					self._insertValueDataPoint(data, sensor, callback);
					//TODO: should add trigger
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
				var result = SensorDataHelper.validGenSensorData(data);
				if(result.status){
					self._insertGenDataPoint(data, sensor, callback);
				}else{
					callback(result);
				}
				break;
			case Sensor.Type.GPS:
				var result = SensorDataHelper.validGPSSensorData(data);
				if(result.status){
					self._insertGPSDataPoint(data, sensor, callback);
				}else{
					callback(result);
				}
				break;
			case Sensor.Type.WEIBO:
				break;
			default :
				callback({message: SensorData.ERR_MESSAGE.SENSOR_TYPE_INVALID, statusCode: 406});
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

	_insertValueData: function(data, callback){

	},

	_insertGenDataPoint: function(data, sensor, callback){
		var self = this;
		var insertData = {};
		var now = Math.round(new Date().getTime() / 1000);

		insertData.sensor_id = sensor.id;
		insertData.data_key = data.key;
		insertData.data_value = JSON.stringify(data.value);
		insertData.data_create_time = now;
		SensorData.insertGenData(insertData, function(err, result){
			if(!err){
				callback({
					status: true,
					statusCode: 200,
					message: ''
				});

				Sensor.update(sensor.id, {sensor_last_update: now, sensor_last_data_gen: insertData.data_value}, function(result){
					//console.log(result);
				});

				Device.updateLastUpdateTime(sensor.device_id, now, function(result){
					//console.log(result);
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

	_insertGPSDataPoint: function(data, sensor, callback){
		if(data.value.offset){
			this._earth2MarsByCoordination(data);
		}

		this._insertGenDataPoint(data, sensor, callback);
	},

	_earth2MarsByCoordination: function(data){

	},


    /**
     * 数据节点列表
     * @param sensorId
     * @param sensor
     * @private
     */
    _listDataPoint: function(sensorId, sensor){
        var self = this;
	    var tableName = "";
	    if(sensor.sensor_type == Sensor.Type.VALUE || sensor.sensor_type == Sensor.Type.SWITCHER){
		    tableName = "yl_sensor_data";
	    }

	    if(sensor.sensor_type == Sensor.Type.GEN || sensor.sensor_type == Sensor.Type.GPS){
		    tableName = "yl_sensor_data_gen";
	    }
        var sql = "select * from " + tableName + " where sensor_id=" + sensorId + " order by data_create_time desc limit 10";
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
	            if(dataKey == ''){
		            SensorData.getLastGenData(sensor.id, function(err, result){
			            !err && self.json(result);
		            });
	            }else{
		            SensorData.getGenData(sensor.id, dataKey, function(err, result){
			            if(!err){
				            if(result){
					            self.json(result);
				            }else{
					            self.exit(SensorData.ERR_MESSAGE.KEY_INVALID, 406);
				            }
			            }else{
				            self.exit(err.code, 406);
			            }
		            });
	            }
                break;
            case Sensor.Type.GPS:
	            if(dataKey == ''){
		            SensorData.getLastGenData(sensor.id, function(err, result){
			            !err && self.json(result);
		            });
	            }else{
		            var timestamp = Date.parse(dataKey);
		            if(timestamp){
			            SensorData.getGenData(sensor.id, timestamp, function(err, result){
				            if(!err){
					            if(result){
						            self.json(result);
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
            case Sensor.Type.WEIBO:
                break;
            default :
                self.exit(SensorData.ERR_MESSAGE.SENSOR_TYPE_INVALID, 406);
                break;
        }
    }
};
oo.extend(SensorDataController, BaseController);

module.exports = SensorDataController;
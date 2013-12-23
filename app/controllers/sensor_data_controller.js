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

	    var sensorLastUpdate = sensor.sensor_last_update;

        this.getRawPost(function(err, data){
            try{
                var data = JSON.parse(data);
                if(data.constructor === Array){
                    //TODO: 添加单个设备数据点，需增加类型判断
	                for(var i in data){
		                self._addSingleDataPoint(data[i], sensor);
	                }
                }else if(data.constructor === Object){
	                self._addSingleDataPoint(data, sensor);
                }

            }catch (e){
	            throw e;
                self.statusCode = 406;
                self.json('JSON字符串内容不规范');
            }
        });
    },

	_addSingleDataPoint: function(data, sensor){
		var self = this;
		var now = Math.round(new Date().getTime() / 1000);
		switch (sensor.sensor_type){
			case Sensor.Type.VALUE:
				var lastUpdate = sensor.sensor_last_update;
				if(now - lastUpdate < 10){
					self.exit(SensorData.ERR_MESSAGE.REQUEST_INTERVAL_TOO_SHORT, 406);
					return;
				}
				var result = SensorDataHelper.validSensorValue(data);
				if(result.status){
					self._insertValueDataPoint(data, sensor);
				}else{
					self.exit(result.message, result.statusCode);
				}
				break;
			case Sensor.Type.SWITCHER:
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

	_insertValueDataPoint: function(data, sensor){
		var self = this;
		var insertData = {};
        var now = Math.round(new Date().getTime() / 1000);
		insertData.sensor_id = sensor.id;
		insertData.data_timestamp = !!data.timestamp ? Math.round(Date.parse(data.timestamp) / 1000) : now;
		insertData.data_value = parseFloat(data.value);
		insertData.data_create_time = now;
		insertData.sensor_status = 1;
		Sensor.insertValueData(insertData, function(result){
			if(result){
				//TODO: update sensor last update
				self.exit("", 200);
			}else{
				self.exit("Server Error", 500);
			}
		});
	}
};
oo.extend(SensorDataController, BaseController);

module.exports = SensorDataController;
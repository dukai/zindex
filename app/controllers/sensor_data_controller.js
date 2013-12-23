var BaseController = require('./base_controller'),
	oo = require('mvc/lib/utils/oo'),
	Device = require('../models/device'),
	Sensor = require('../models/sensor'),
	SensorData = require('../models/sensor_data');

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
        var db = this.getDb();
        var sql = '';
        if(arguments.length == 2){
            callback = sensorId;

	        Device.exists(this.member.user_login, deviceId, function(row){
		        if(row){
			        callback(row);
		        }else{
			        self.statusCode = 406;
			        self.json("API Key And Device Id  Not Match or Sensor Id NOT Exits");
		        }

	        })
        }else{
	        Sensor.exists(this.member.user_login, deviceId, sensorId, function(row){
		        if(row){
			        callback(row);
		        }else{
			        self.statusCode = 406;
			        self.json("API Key And Device Id  Not Match or Sensor Id NOT Exits");
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
                self.statusCode = 406;
                self.json('JSON字符串内容不规范');
            }
        });
    },

	_addSingleDataPoint: function(data, sensor){
		switch (sensor.sensor_type){
			case Sensor.Type.VALUE:
				break;
		}
	}
};
oo.extend(SensorDataController, BaseController);

module.exports = SensorDataController;
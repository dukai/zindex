var AbstractModel = require('mvc/lib/abstract_model'),
    oo = require('mvc/lib/utils/oo');


var Sensor = function(){
    this._initSensor();
};

Sensor.prototype = {
    _initSensor: function(){
        AbstractModel.call(this);
    }
};

oo.extend(Sensor, AbstractModel);

Sensor.exists = function(userLogin, deviceId, sensorId, callback){
	var db = AbstractModel.getDb();

	var sql = "select * from yl_sensors where user_login='" + userLogin + "' and device_id=" + deviceId + " and id=" + sensorId;
	db.fetchRow(sql, function(err, result){
		if(!err){
			callback(result);
		}else{
			callback(false);
		}
	});
};


Sensor.updateLastUpdateTime = function(sensorId, timestamp, callback){
    var db = AbstractModel.getDb();
    timestamp = timestamp ? timestamp : Math.round(new Date().getTime() / 1000);
    db.update('yl_sensors', {sensor_last_update: timestamp}, {id: sensorId}, function(err, result){
        if(!err){
            callback(result);
        }else{
            console.log(err);
        }
    });
}

Sensor.update = function(sensorId, data, callback){
    var db = AbstractModel.getDb();
    db.update('yl_sensors', data, {id: sensorId}, function(err, result){
        if(!err){
            callback(result);
        }else{
            console.log(err);
        }
    });
}

Sensor.ERR_MESSAGE = {
	API_KEY_DEVICE_SENSOR_NOT_MATCH: 'API Key And Device Id  Not Match or Sensor Id NOT Exits'
};


Sensor.Type = {
	VALUE: 0,
	SWITCHER: 5,
	GPS: 6,
	GEN: 8,
	PHOTO: 9,
	WEIBO: 10
};

Sensor.DataType = {
	VALUE: 0,
	EVENT: 1,
	GEN: 3,
	BIN: 4
};



module.exports = Sensor;
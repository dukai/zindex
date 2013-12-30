var AbstractModel = require('mvc/lib/abstract_model'),
	oo = require('mvc/lib/utils/oo'),
    Sensor = require('./sensor'),
    Device = require('./device');

var SensorData = function(options){
	this._initSensorData(options);
};

SensorData.prototype = {
	_initSensorData: function(options){
		AbstractModel.call(this, options);
	}
};

SensorData.ERR_MESSAGE = {
	VALUE_FORMAT_INVALID: 'Value Format Incorrect.',
	TIMESTAMP_FORMAT_INVALID: 'Timestamp format incorrect.',
	LAT_OR_LNG_INVALID: 'lat or lng is invalid.',
	DATA_FORMAT_INVALID: 'Data format incorrect.',
    KEY_INVALID: "Key Invalid",
	REQUEST_INTERVAL_TOO_SHORT: "Request interval is too short (should > 10s)",
	MYSQL_ERROR: "Mysql Error: "
};

oo.extend(SensorData, AbstractModel);



SensorData.insertValueData = function(data, callback){
    var db = AbstractModel.getDb();
    db.insert('yl_sensor_data', data, function(err, result){
        callback(err, result);
        err && console.log(err);
    });
};

SensorData.insertGenData = function(data, callback){
	var db = AbstractModel.getDb();
	db.insert('yl_sensor_data_gen', data, function(err, result){
		callback(err, result);
		err && console.log(err);
	});
}

SensorData.getValueData = function(sensorId, timestamp, callback){
    var sql = "select * from yl_sensor_data where sensor_id=" + sensorId + " data_timestamp=" + timestamp + " limit 1";
    var db = AbstractModel.getDb();
    db.fetchRow(sql, function(err, row){
        callback(err, row);
    });
};

SensorData.getLastValueData = function(sensorId, callback){
    var sql = "select sensor_last_update as timestamp, sensor_last_data as value from yl_sensors where id=" + sensorId + " limit 1";
    var db = AbstractModel.getDb();
    db.fetchRow(sql, function(err, row){
        callback(err, row);
    });
}

SensorData.getLastGenData = function(sensorId, callback){
	var sql = "select sensor_last_update as timestamp, sensor_last_data_gen as value  from yl_sensors where id=" + sensorId + " limit 1";
	var db = AbstractModel.getDb();
	db.fetchRow(sql, function(err, row){
		if(row && row.value){
			row.value = JSON.parse(row.value);
		}
		callback(err, row);
	});
};

SensorData.getGenData = function(sensorId, key, callback){
	var sql = "select data_value as value from yl_sensor_data_gen where sensor_id=" + sensorId + " and data_key='" + key + "' limit 1";
	var db = AbstractModel.getDb();
	db.fetchRow(sql, function(err, row){
		if(row && row.value){
			row.value = JSON.parse(row.value);
		}
		callback(err, row);
	});
}

module.exports = SensorData;
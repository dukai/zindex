var AbstractModel = require('mvc/lib/abstract_model'),
	oo = require('mvc/lib/utils/oo'),
	utils = require('mvc/lib/utils'),
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
	MYSQL_ERROR: "Mysql Error: ",
    SENSOR_TYPE_INVALID: "Sensor Type Invalid",
	PHOTO_SIZE_TOO_LARGE: "Photo size too large"
};

SensorData.PHOTO_MAX_SIZE = 200;

oo.extend(SensorData, AbstractModel);


//添加数值数据
SensorData.insertValueData = function(data, callback){
    var db = AbstractModel.getDb();
    db.insert('yl_sensor_data', data, function(err, result){
        callback(err, result);
        err && console.log(err);
    });
};
//添加泛型数据
SensorData.insertGenData = function(data, callback){
	var db = AbstractModel.getDb();
	db.insert('yl_sensor_data_gen', data, function(err, result){
		callback(err, result);
		err && console.log(err);
	});
}

SensorData.insertPhotoData = function(data, callback){
	var db = AbstractModel.getDb();
	db.insert('yl_sensor_data_photos', data, function(err, result){
		callback(err, result);
		err && utils.debug(err, 'ERR');
	})
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

SensorData.getPhotoSize = function(sensorId, callback){
	var sql = "SELECT sum(photo_size) AS sum_size FROM yl_sensor_data_photos WHERE sensor_id=" + sensorId + " AND 1=1";
	var db = AbstractModel.getDb();
	db.fetchRow(sql, function(err, row){
		if(row){
			callback(row.sum_size);
		}else{
			callback(err, row);
		}

	});
}

module.exports = SensorData;
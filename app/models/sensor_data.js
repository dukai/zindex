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
	REQUEST_INTERVAL_TOO_SHORT: "Request interval is too short (should > 10s)"
};

oo.extend(SensorData, AbstractModel);



SensorData.insertValueData = function(data, callback){
    var db = AbstractModel.getDb();
    db.insert('yl_sensor_data', data, function(err, result){
        callback(err, result);
        err && console.log(err);
    });
};

module.exports = SensorData;
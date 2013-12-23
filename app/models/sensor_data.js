var AbstractModel = require('mvc/lib/abstract_model'),
	oo = require('mvc/lib/utils/oo');

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
	DATA_FORMAT_INVALID: 'Data format incorrect.'
};

oo.extend(SensorData, AbstractModel);

module.exports = SensorData;
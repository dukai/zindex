var SensorData = require('../models/sensor_data');

var SensorDataHelper = {

	validValueSensorData: function(data){
		if(!parseFloat(data.value)){
			return {
				status: false,
				message: SensorData.ERR_MESSAGE.VALUE_FORMAT_INVALID,
				statusCode: 406
			};
		}


		if(!!data.timestamp && !Date.parse(data.timestamp)){
			return {
				status: false,
				message: SensorData.ERR_MESSAGE.TIMESTAMP_FORMAT_INVALID,
				statusCode: 406
			};
		}

		return {status: true};
	}


};


module.exports = SensorDataHelper;
var SensorData = require('../models/sensor_data');

var SensorDataHelper = {
	/**
	 * 验证数据型数据节点有效性
	 * @param data
	 * @returns {*}
	 */
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
	},

	validSwitcherSensorData: function(data){
		var val = parseInt(data.value);
		if(isNaN(val) || (val !== 1 && val !== 0)){
			return {
				status: false,
				message: SensorData.ERR_MESSAGE.VALUE_FORMAT_INVALID,
				statusCode: 406
			};
		}

		return {status: true};
	}


};


module.exports = SensorDataHelper;
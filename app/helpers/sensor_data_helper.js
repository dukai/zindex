var SensorData = require('../models/sensor_data');

var SensorDataHelper = {
	/**
	 * 验证数据型数据节点有效性
	 * @param data
	 * @returns {status: bool, message: string, statusCode: number}
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
	},

	validGenSensorData: function(data){
		if(!data.value || data.value.toSource().length > 1024){
			return {
				status: false,
				message: SensorData.ERR_MESSAGE.VALUE_FORMAT_INVALID,
				statusCode: 406
			};
		}

		if(!data.key || data.key.length > 128){
			return {
				status: false,
				message: SensorData.ERR_MESSAGE.KEY_INVALID,
				statusCode: 406
			};
		}

		return {status: true};

	},

	validGPSSensorData: function(data){
		var genResult = this.validGenSensorData(data).status
		if(genResult.status){

			if(data.value.constructor !== Object){
				return {
					status: false,
					message: SensorData.ERR_MESSAGE.VALUE_FORMAT_INVALID,
					statusCode: 406
				};
			}

			if(!(data.value.lat && data.value.lng) && !(data.value.lat_dd && data.value.lng_ddd) && !(data.value.lat_ddmm && data.value.lng_dddmm)){

			}


		}else{
			return genResult;
		}
	},

	validPhotoSensorData: function(data){

	}




};


module.exports = SensorDataHelper;
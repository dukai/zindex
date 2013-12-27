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

		if(!!data.timestamp && !Date.parse(data.timestamp)){
			return {
				status: false,
				message: SensorData.ERR_MESSAGE.TIMESTAMP_FORMAT_INVALID,
				statusCode: 406
			};
		}

		return {status: true};
	},

	validGenSensorData: function(data){
		if(!data.value || JSON.stringify(data.value).length > 1024){
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

		if(!!data.timestamp && !Date.parse(data.timestamp)){
			return {
				status: false,
				message: SensorData.ERR_MESSAGE.TIMESTAMP_FORMAT_INVALID,
				statusCode: 406
			};
		}

		return {status: true};

	},

	validGPSSensorData: function(data){
		data.key = data.timestamp ? data.timestamp : Math.round(new Date().getTime() / 1000);
		var genResult = this.validGenSensorData(data);
		if(genResult.status){
			if(data.value.constructor !== Object){
				return {
					status: false,
					message: SensorData.ERR_MESSAGE.VALUE_FORMAT_INVALID,
					statusCode: 406
				};
			}

			if(!(data.value.lat !== undefined && data.value.lng !== undefined)
					&& !(data.value.lat_dd !== undefined && data.value.lng_ddd !== undefined)
					&& !(data.value.lat_ddmm !== undefined && data.value.lng_dddmm !== undefined)){
				return {
					status: false,
					message: SensorData.ERR_MESSAGE.VALUE_FORMAT_INVALID,
					statusCode: 406
				};
			}


			if(data.value.lat !== undefined && data.value.lng !== undefined
					&& (Math.abs(parseFloat(data.value.lat)) > 90 || Math.abs(parseFloat(data.value.lng)) > 180)) {
				return {
					status: false,
					message: SensorData.ERR_MESSAGE.LAT_OR_LNG_INVALID,
					statusCode: 406
				}
			}

			if(data.value.lat_dd !== undefined && data.value.lng_ddd !== undefined
				&& (Math.abs(parseFloat(data.value.lat_dd)) > 90 || Math.abs(parseFloat(data.value.lng_ddd)) > 180)) {
				return {
					status: false,
					message: SensorData.ERR_MESSAGE.LAT_OR_LNG_INVALID,
					statusCode: 406
				}
			}

			if(data.value.lat_ddmm !== undefined && data.value.lng_dddmm !== undefined
				&& (Math.abs(parseFloat(data.value.lat_ddmm)) > 9060 || Math.abs(parseFloat(data.value.lng_dddmm)) > 18060)) {
				return {
					status: false,
					message: SensorData.ERR_MESSAGE.LAT_OR_LNG_INVALID,
					statusCode: 406
				}
			}

			return {status:true};


		}else{
			return genResult;
		}
	},

	validPhotoSensorData: function(data){

	}




};


module.exports = SensorDataHelper;
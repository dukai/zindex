var helper = require("../../app/helpers/sensor_data_helper");

console.log(helper.validGPSSensorData({
	value :{"lat":35.4567,"lng":46.1234,"speed":98.2,"offset":"yes"}
}));

console.log(helper.validGPSSensorData({
	value :{"lat_dd":35,"lng_ddd":046,"speed":98.2,"offset":"yes"}
}));

console.log(helper.validGPSSensorData({
	value :{"lat_ddmm":3530,"lng_dddmm":04610,"speed":98.2,"offset":"yes"}
}));

console.log(helper.validGPSSensorData({
	value :{"lat":35.4567,"speed":98.2,"offset":"yes"}
}));

console.log(helper.validGPSSensorData({
	value :{"lat":35.4567,"lng_ddd":46.1234,"speed":98.2,"offset":"yes"}
}));

exports.serverinfo = {
	port: 8001
};

exports.db = {
	host: 'localhost',
	user: 'root',
	password: 'yeelink',
	database: 'yeelink',
	charset: 'UTF8_GENERAL_CI'
};

exports.template = {
	isCache: false
};

exports.app_path = '';
exports.file_path = '';


exports.routes = [
	//Device.Create, Device.List
	{
		url: '/v1.1/devices',
		module: 'api',
		controller: 'device',
		action: 'index'
	},
	//Device.View, Device.Edit, Device.Delete
	{
		url: '/v1.1/device/{device_id}',
		module: 'api',
		controller: 'device',
		action: 'single'
	},
	//Sensor: Create, List
	{
		url: '/v1.1/device/{device_id}/sensors',
		module: 'api',
		controller: 'sensor',
		action: 'index'
	},
	//History Data
	{
		url: '/v1.1/device/{device_id}/sensor/{sensor_id}.json',
		module: 'api',
		controller: 'sensor-data',
		action: 'history-data'
	},
	//Sensor: View, Edit, Delete
	{
		url: '/v1.1/device/{device_id}/sensor/{sensor_id}',
		module: 'api',
		controller: 'sensor',
		action: 'single'
	},

	{
		url: '/v1.1/device/{device_id}/sensor/{sensor_id}/datapoints',
		module: 'api',
		controller: 'sensor-data',
		action: 'datapoints'
	},

	{
		url: '/v1.1/device/{device_id}/sensor/{sensor_id}/datapoint/{key}',
		module: 'api',
		controller: 'sensor-data',
		action: 'singlePoint'
	},

	{
		url: '/v1.1/user/api-key',
		module: 'api',
		controller: 'api-key',
		action: 'index'
	}

];
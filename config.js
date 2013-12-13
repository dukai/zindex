exports.serverinfo = {
	port: 8001
};

exports.db = {};

exports.template = {
	isCache: false
};

exports.app_path = '';
exports.file_path = '';


exports.routes = [
	{
		url: '/v1.1/devices',
		module: 'api',
		controller: 'device',
		action: 'index'
	},

	{
		url: '/v1.1/devices/{device_id}',
		module: 'api',
		controller: 'device',
		action: 'show'
	},

	{
		url: '/v1.1/devices/{device_id}/sensors',
		module: 'api',
		controller: 'device',
		action: 'sensors'
	},

	{
		url: '/v1.1/device/{device_id}/sensor/{sensor_id}.json',
		module: 'api',
		controller: 'device',
		action: 'history-data'
	},

	{
		url: '/v1.1/user/api-key',
		module: 'api',
		controller: 'device',
		action: 'history-data'
	}

];
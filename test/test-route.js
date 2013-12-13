var route = require('../lib/route.js');
var r = new route.Route({
    url: '/v1.1/device/{device_id}/sensor/{sensor_id}.json',
    module: 'api',
    controller: 'device',
    action: 'history-data'
});

var r2 = new route.Route({
    url: '/v1.1/devices/{device_id}/sensors',
    module: 'api',
    controller: 'device',
    action: 'sensors'
});
var r3 = new route.Route({
	url: '/{controller}/{action}',
	module: 'api',
	controller: 'index',
	action: 'index'
});

/*
console.log(r.match("/v1.1/device/1221/sensor/2312.json"));
console.log(r2.match("/v1.1/device/1221/sensor/2312.json"));
*/
console.log(r3.match("/index/index/asdfasdf?ddd=sdf"));
console.log(r3);

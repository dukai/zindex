var route = require('mvc/lib/route.js');
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

var r4 = new route.Route({
	url: '/v1.1/device/{device_id}/sensor/{sensor_id}',
	module: 'api',
	controller: 'device',
	action: 'history-data'
});

var r5 = new route.Route({
	url: '/v1.1/device/{device_id}/sensor/{sensor_id}/datapoints',
	module: 'api',
	controller: 'sensor-data',
	action: 'datapoints'
});


var r6 = new route.Route({
    url: '/v1.1/device/{device_id}/sensor/{sensor_id}/datapoint/{key}',
    module: 'api',
    controller: 'sensor-data',
    action: 'single-point'
});

console.log(r6.match('/v1.1/device/1424525/sensor/22424/datapoint'));
console.log(r6.match('/v1.1/device/1424525/sensor/22424/datapoint/324343'));
/*
console.log(r5.match('/v1.1/device/1424525/sensor/22424/datapoints'));
console.log(r.match("/v1.1/device/1221/sensor/2312.json"));
console.log(r.match('/v1.1/device/2440/sensor/3243'));
console.log(r3.match('/'));


console.log(r4.match('/v1.1/device/2440/sensor/3243'));
console.log(r4.match('/v1.1/device/2440/sensor/3243.json'));

console.log(r2.match("/v1.1/device/1221/sensor/2312.json"));
console.log(r4.match("/v1.1/device/1221/sensor/2312.json"));
console.log(r4.match("/v1.1/device/1221/sensor/2312"));
console.log(r4.match('/v1.1/device/2440/sensor/3243'));

 */

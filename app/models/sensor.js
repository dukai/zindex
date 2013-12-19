var AbstractModel = require('mvc/lib/abstract_model'),
    oo = require('mvc/lib/utils/oo');


var Sensor = function(){
    this._initSensor();
};

Sensor.prototype = {
    _initSensor: function(){
        AbstractModel.call(this);
    }
};

oo.extend(Sensor, AbstractModel);

Sensor.Type = {
	DATA: 0,
	SWITCHER: 5,
	GPS: 6,
	GEN: 8,
	PHOTO: 9,
	WEIBO: 10
};

Sensor.DataType = {
	VALUE: 0,
	EVENT: 1,
	GEN: 3,
	BIN: 4
};

module.exports = Sensor;
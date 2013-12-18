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

module.exports = Sensor;
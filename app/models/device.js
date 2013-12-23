var AbstractModel = require('mvc/lib/abstract_model'),
	oo = require('mvc/lib/utils/oo');


var Device = function(){
	this._initDevice();
};

Sensor.prototype = {
	_initDevice: function(){
		AbstractModel.call(this);
	}
};

oo.extend(Device, AbstractModel);

Device.exists = function(userLogin, deviceId, callback){
	var db = AbstractModel.getDb();

	var sql = "select * from yl_devices where user_login='" + userLogin + "' and id=" + deviceId ;
	db.fetchRow(sql, function(err, result){
		if(!err){
			callback(result);
		}else{
			callback(false);
		}
	});
}




module.exports = Device;
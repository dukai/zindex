var AbstractModel = require('mvc/lib/abstract_model'),
	oo = require('mvc/lib/utils/oo');


var Device = function(){
	this._initDevice();
};

Device.prototype = {
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
};

Device.updateLastUpdateTime = function(deviceId, timestamp, callback){
    var db = AbstractModel.getDb();
    timestamp = timestamp ? timestamp : Math.round(new Date().getTime() / 1000);
    db.update('yl_devices', {device_last_data_update: timestamp}, {id: deviceId}, function(err, result){
        if(!err){
            callback(result);
        }else{
            console.log(err);
        }
    });
};


Device.ERR_MESSAGE = {
	API_KEY_DEVICE_NOT_MATCH: "API Key And Device Id NOT Match"
};

module.exports = Device;
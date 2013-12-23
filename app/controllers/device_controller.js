var BaseController = require('./base_controller'),
	oo = require('mvc/lib/utils/oo'),
	Device = require('../models/device');

var DeviceController = function(intent){
	this._initDeviceController(intent);
};

DeviceController.prototype = {
	_initDeviceController: function(intent){
		BaseController.call(this, intent);
	},
	_init: function(dispatchActionCallback){
        this.setNoRender();
		DeviceController.parent._init.call(this, function(status){
            dispatchActionCallback(true);
        });
	},
	indexAction: function(){
		var self = this;

		switch (this._getMethod()){
			case 'get':
				this._listDevice();
				break;
			case 'post':
				this._createDevice();
				break;
			default :
				this._undefinedAction();
				break;
		}

	},

	singleAction: function(){
		var self = this;
        var deviceId = this.getParam('device_id', 0);

        this._checkPermission(deviceId, function(){
            switch (self._getMethod()){
                case 'get':
                    self._viewDevice(deviceId);
                    break;
                case 'put':
                    self._editDevice(deviceId);
                    break;
                case 'delete':
                    self._deleteDevice(deviceId);
                    break;
                default :
                    self._undefinedAction();
                    break;
            }
        });


	},
	/**
	 * 检查设备ID与用户信息是否相符
	 * @param deviceId
	 * @param callback
	 * @private
	 */
    _checkPermission: function(deviceId, callback){
	    var self = this;
		Device.exists(this.member.user_login, deviceId, function(row){
			if(row){
				callback(row);
			}else{
				self.exit(Device.ERR_MESSAGE.API_KEY_DEVICE_NOT_MATCH, 406);
			}
		});
    },

	_createDevice: function(){
        var self = this;
        var db = this.getDb();

		this.getRawPost(function(err, data){
            try{
                var data = JSON.parse(data);
                var device = {
                    'user_login': self.member.user_login,
                    'device_uuid':'',
                    'device_manufacturer':1,
                    'device_title':data['title'],
                    'device_about':data['about'],
                    'device_tags':data['tags'].join(','),
                    'device_loc_name':data['location']['local'],
                    'device_lat':parseFloat(data['location']['latitude']),
                    'device_lng':parseFloat(data['location']['longitude']),
                    'device_exposure':1,
                    'device_disposition':1,
                    'device_privacy':1,
                    'device_status':1
                };
                 db.insert('yl_devices', device, function(err, result) {
                 self.json((result.insertId));
                 });

            }catch (e){
                self.json(('JSON字符串内容不规范'));
            }


		});
	},
	_listDevice: function(){
        var self = this;
        var db = this.getDb();
		var sql = "select * from yl_devices where user_login='" + this.member.user_login + "' limit 20";
        db.fetchAll(sql, function(err, rows, fields) {
            self.json(rows);
        });
	},

	_viewDevice: function(deviceId){
		var self = this;
		this.getDb().fetchRow("select * from yl_devices where id=" + deviceId, function(err, row){
            //TODO: format data
			self.json(row);
		});
	},
	_editDevice: function(deviceId){
        var self = this;
        var db = this.getDb();
        this.getRawPost(function(err, data){
            try{
                var data = JSON.parse(data);
                var device = {};

                if(data.title){
                    device.device_title = data.title;
                }

                if(data.about){
                    device.device_about = data.about;
                }
                if(data.tags){
                    device.device_tags = data['tags'].join(',');
                }

                if(data.location && data.location.local){
                    device.device_loc_name = data['location']['local'];
                }
                if(data.location && data.location.latitude){
                    device.device_lat = data['location']['latitude'];
                }
                if(data.location && data.location.longitude){
                    device.device_lng = data['location']['longitude'];
                }

                db.update('yl_devices', device, {id: deviceId}, function(err, result) {
                    self.json(1);
                });

            }catch (e){
                console.log(e);
                self.json('JSON字符串内容不规范');
            }


        });
	},
    /**
     * 删除设备
     * @private
     */
	_deleteDevice: function(deviceId){
        var self = this;
        this.getDb().fetchRow("delete from yl_devices where id=" + deviceId, function(err, row){
            self.response.writeHead(200, {});
            self.response.end();
        });
	}
}

oo.extend(DeviceController, BaseController);

module.exports = DeviceController;
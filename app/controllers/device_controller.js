var BaseController = require('./base_controller'),
	oo = require('mvc/lib/utils/oo');
var util = require('util');

var DeviceController = function(intent){
	this._initDeviceController(intent);
};

DeviceController.prototype = {
	_initDeviceController: function(intent){
		BaseController.call(this, intent);
	},
/*
	_init: function(){
		DeviceController.parent._init.call(this);
		//console.log('init device controller');
	},
*/
	indexAction: function(){
		this.setNoRender();

		var self = this;

		switch (this._getMethod()){
			case 'get':
				this._listDevice();
				break;
			case 'post':
				this._createDevice();
				break;
		}

	},

	singleAction: function(){
		var self = this;
		this.setNoRender();
		switch (this._getMethod()){
			case 'get':
				this._viewDevice();
				break;
			case 'put':
				this._editDevice();
				break;
			case 'delete':
				this._deleteDevice();
				break;
		}
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
                 self.json(JSON.stringify(result.insertId));
                 });

            }catch (e){
                self.json(JSON.stringify('JSON字符串内容不规范'));
            }


		});
	},
	_listDevice: function(){
        var self = this;
        var db = this.getDb();
        db.fetchAll('select * from yl_devices limit 20', function(err, rows, fields) {
            self.json(JSON.stringify(rows));
        });
	},

	_viewDevice: function(){
		var self = this;
		this.getDb().fetchRow("select * from yl_devices where id=" + this.getParam('device_id', 0), function(err, row){
			self.json(JSON.stringify(row));
		});
	},
	_editDevice: function(){

	},
    /**
     * 删除设备
     * @private
     */
	_deleteDevice: function(){
        var self = this;
        this.getDb().fetchRow("delete from yl_devices where id=" + this.getParam('device_id', 0), function(err, row){
            self.response.writeHead(200, {});
            self.response.end();
        });
	}
}

oo.extend(DeviceController, BaseController);

module.exports = DeviceController;
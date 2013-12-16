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
		this.getRawPost(function(err, data){
            var data = JSON.parse(data);
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
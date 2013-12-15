var AbstractController = require('mvc/lib/abstract_controller'),
	oo = require('mvc/lib/utils/oo');
var debug = require('mvc/lib/utils/debug').debug;
var util = require('util');

var IndexController = function(intent){
	this._initIndexController(intent);
};

IndexController.prototype = {
	_initIndexController: function(intent){
		AbstractController.call(this, intent);
	},

	indexAction: function(){
		this.view.username =  '杜凯',
		this.view.age = '26',
		this.view.sex = '男'
	},

    testAction: function(){
        this.setNoRender();
        this.redirect('/');
    }
}

oo.extend(IndexController, AbstractController);

module.exports = IndexController;
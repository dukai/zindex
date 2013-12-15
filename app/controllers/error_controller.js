var AbstractController = require('mvc/lib/abstract_controller'),
    oo = require('mvc/lib/utils/oo');
var debug = require('mvc/lib/utils/debug').debug;
var util = require('util');

var ErrorController = function(intent){
    this._initErrorController(intent);
};

ErrorController.prototype = {
    _initErrorController: function(intent){
        AbstractController.call(this, intent);
    },

    indexAction: function(){
        this.view.username =  '杜凯',
            this.view.age = '26',
            this.view.sex = '男'
    }
}

oo.extend(ErrorController, AbstractController);

module.exports = ErrorController;
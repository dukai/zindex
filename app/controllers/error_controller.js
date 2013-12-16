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
        this.view.message = this.getParam('message');
        this.view.info = this.getParam('info');
    }
}

oo.extend(ErrorController, AbstractController);

module.exports = ErrorController;
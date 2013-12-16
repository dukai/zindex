var AbstractModel = require('mvc/lib/abstract_model'),
    oo = require('mvc/lib/utils/oo');


var User = function(){
    this._initUser();
};

User.prototype = {
    _initUser: function(){
        AbstractModel.call(this);
    },

    /**
     * 根据APIKey判断用户是否存在
     * @param apiKey
     * @param callback(status)
     */
    existsByAPIKey: function(apiKey, callback){
        var sql = "select * from yl_users where user_access_key='" + apiKey + "' limit 1";
        this.db.fetchRow(sql, function(err, row){
            if(row){
                callback(true, row);
            }else{
                callback(false);
            }
        });
    }
};

oo.extend(User, AbstractModel);

module.exports = User;
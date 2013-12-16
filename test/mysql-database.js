var MysqlDatabase = require('mvc/lib/mysql_database.js');
var config = require('../config');

var db = new MysqlDatabase(config.db);

db.fetchRow('select * from yl_devices where id=57271', function(err, row){
    console.log(row);
});

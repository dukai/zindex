var config = require('mvc/lib/config');
var ci = require('../config');
config.addConfig(ci);
console.log(config.routes.app_path);
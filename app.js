var config = require('./config'),
    application = require('mvc');

APP_PATH = __dirname + '/app';
FILE_PATH = __dirname + '/public';

config.app_path = APP_PATH;
config.file_path = FILE_PATH;

application.run(config);
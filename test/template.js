var tmpl = require('../lib/template').tmpl;

var path = __dirname + '/tmpl.nhtml';

var t = tmpl(path);

console.log(t.render({}));
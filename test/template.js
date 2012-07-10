var fs = require('fs');

var Template = require('../lib/template_v2').Template;

var path = __dirname + '/tmpl.nhtml';
//var t = tmpl(path);

content = fs.readFileSync(path, 'utf8');

var tmpl = new Template(content);

console.log(tmpl.render({a: 'dk'}));
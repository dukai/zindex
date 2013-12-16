var tableName = "articles";
var data = {
	title: 'hello world!'
}

var where = {
	id: 1
}
var mysql = require('mysql');
var sql = "update ?? set ? where ?";
var inserts = [tableName, data, where];
sql = mysql.format(sql, inserts);

console.log(sql);
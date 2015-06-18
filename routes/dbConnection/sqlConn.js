/**
 * New node file
 * To create mysql connection pool.
 */
var mysql = require('mysql');
var pool  = mysql.createPool({
	host     : 'us-cdbr-iron-east-02.cleardb.net',
	user     : 'bbfb1e01b28e70',
	password : 'd0ca05bb',
	database : 'ad_c118a14314de2dc',
	//port     : '3306',
//	database : 'vlibdb',
	connectionLimit : '2'
});

exports.pool = pool;

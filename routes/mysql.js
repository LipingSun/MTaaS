var mysql = require('mysql');
var squel = require('squel');
var crypto = require('crypto');


var getConnectionPool = function() {
    var mysqlConnection = null;
    if (process.env.OPENSHIFT_MYSQL_DB_HOST) {
        mysqlConnection = {
            host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
            port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
            user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
            password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
            database : 'mtaas'
        };
    } else {
        mysqlConnection = {
            host     : '127.0.0.1',
            port     : '3307',
            user     : 'adminYPlWlrC',
            password : 'yBWDv3iCRCfr',
            database : 'mtaas'
            //connectionLimit: 15,
            //multipleStatements: true
        };
    }
    return mysql.createPool(mysqlConnection);
};

exports.getConnectionPool = getConnectionPool;
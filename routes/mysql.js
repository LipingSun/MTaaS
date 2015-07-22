var mysql = require('mysql');
var squel = require('squel');
var crypto = require('crypto');

////provide a sensible default for local development
//mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
////take advantage of openshift env vars when available:
//if(process.env.OPENSHIFT_MONGODB_DB_URL){
//    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
//}

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
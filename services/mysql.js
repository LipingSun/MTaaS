var mysql = require('mysql');

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

mysql.query = function (sql, callback) {
    console.log('SQL: ' + sql);
    getConnectionPool().query(sql, callback);
};

function execQuery (sql, params, callback) {
    var connPool = getConnectionPool();
    connPool.getConnection(function (err, connection) {
        if (err) {
            console.log('MySql connection error: ' + err);
            callback(err, true);
            return;
        }
        console.log("Query is >>>>>"+sql+params[0]);
        var qResult = connection.query(sql, params, callback);
        qResult.on('error', function(err) {
            console.log('MySql query error: ' + err);
            callback(err, true);
        });
        qResult.on('result', function(rows) {
            console.log('Got result from DB');
            callback(false, rows);
        });
        qResult.on('end', function() {
            console.log('Going to release DB connection to the Pool');
            connection.release();
        });
    });
}

module.exports = mysql;
exports.getConnectionPool = getConnectionPool;
exports.execQuery = execQuery;
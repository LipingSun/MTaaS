var mysql = require('mysql');

var getConnectionPool = function() {
    var setting = null;
    if (process.env.OPENSHIFT_MYSQL_DB_HOST) {
        setting = {
            host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
            port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
            user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
            password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
            database : 'mtaas',
            timezone : 'utc',
            connectionLimit: 120//,
            //acquireTimeout: 100000
        };
    } else {
        setting = {
            host     : '127.0.0.1',
            port     : '3307',
            user     : 'adminYPlWlrC',
            password : 'yBWDv3iCRCfr',
            database : 'mtaas',
            timezone : 'utc',
            connectionLimit: 120//,
            //acquireTimeout: 100000
            //multipleStatements: true
        };
    }
    //setting.connectTimeout = 100000;
    return mysql.createPool(setting);
};

getConnectionPool().query("SET @@global.time_zone='+00:00'");

mysql.query = function (sql, callback) {
    console.log('SQL: ' + sql);
    getConnectionPool().getConnection(function (err, connection) {
        connection.query(sql, function (err, data) {
            connection.release();
            if (err) {
                console.log('DB ' + err);
                //callback(err);
                return;
            } else {
                console.log('DB Result: ' + JSON.stringify(data));
                callback(null, data);
            }
        });
        connection.on('error', function(err) {
            console.log('DB ' + err);
            return;
        });
    });
};

mysql.queryOne = function (sql, callback) {
    console.log('SQL: ' + sql);
    getConnectionPool().getConnection(function (err, connection) {
        connection.query(sql, function (err, data) {
            connection.release();
            if (err) {
                console.log('DB ' + err);
                //callback(err);
                return;
            } else {
                console.log('DB Result: ' + JSON.stringify(data[0]));
                callback(null, data[0]);
            }
        });
        connection.on('error', function(err) {
            console.log('DB ' + err);
            return;
        });
    });
};

mysql.execQuery = function (sql, params, callback) {
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
};

module.exports = mysql;
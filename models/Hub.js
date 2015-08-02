'use strict';

var mysql = require('./../services/mysql');
var squel = require('squel');

var Hub = {};

Hub.findAll = function (callback) {
    var sql = squel.select().from('hub');
    mysql.query(sql.toString(), callback);
};

Hub.findById = function (id, callback) {
    var sql = squel.select().from('hub').where('id = ' + id);
    mysql.queryOne(sql.toString(), callback);
};

Hub.findOne = function (obj, callback) {
    var condition = Object.keys(obj)[0] + ' = ' +  mysql.escape(obj[Object.keys(obj)[0]]);
    var sql = squel.select().from('hub').where(condition);
    mysql.queryOne(sql.toString(), callback);
};

Hub.create = function (hub, callback) {
    var sql = squel.insert().into('hub').setFields(hub).toString();
    mysql.query(sql, function (err, data) {
        if (!err) {
            sql = squel.select().from('hub').where('id = ' + data.insertId);
            mysql.queryOne(sql.toString(), callback);
        }
    });
};

Hub.deleteById = function (id, callback) {
    var sql = squel.delete().from('hub').where('id = ' + id);
    mysql.query(sql.toString(), callback);
};

Hub.update = function (id, hub, callback) {
    var sql = squel.update().table('hub').setFields(hub).where('id = ' + id);
    mysql.query(sql.toString(), function (err) {
        if (!err) {
            sql = squel.select().from('hub').where('id = ' + id);
            mysql.queryOne(sql.toString(), callback);
        }
    });
};

module.exports = Hub;
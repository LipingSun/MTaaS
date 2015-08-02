'use strict';

var mysql = require('./../services/mysql');
var squel = require('squel');

var DeviceHost = {};

DeviceHost.findAll = function (callback) {
    var sql = squel.select().from('device_host').toString();
    mysql.query(sql, callback);
};

DeviceHost.findById = function (id, callback) {
    var sql = squel.select().from('device_host').where('id = ' + id).toString();
    mysql.queryOne(sql, callback);
};

DeviceHost.findOne = function (obj, callback) {
    var condition = Object.keys(obj)[0] + ' = ' +  mysql.escape(obj[Object.keys(obj)[0]]);
    var sql = squel.select().from('device_host').where(condition).toString();
    mysql.queryOne(sql, callback);
};

DeviceHost.create = function (device_host, callback) {
    var sql = squel.insert().into('device_host').setFields(device_host).toString();
    mysql.query(sql, callback);
};

DeviceHost.deleteById = function (id, callback) {
    var sql = squel.delete().from('device_host').where('id = ' + id).toString();
    mysql.query(sql, callback);
};

DeviceHost.update = function (id, device_host, callback) {
    var sql = squel.update().table('device_host').setFields(device_host).where('id = ' + id).toString();
    mysql.query(sql, callback);
};

module.exports = DeviceHost;
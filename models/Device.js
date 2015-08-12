'use strict';

var mysql = require('./../services/mysql');
var squel = require('squel');

var Device = {};

Device.findAll = function (callback) {
    var sql = squel.select().from('device');
    mysql.query(sql.toString(), callback);
};

Device.findById = function (id, callback) {
    var sql = squel.select().from('device').where('id = ' + id);
    mysql.queryOne(sql.toString(), callback);
};

Device.findOne = function (obj, callback) {
    var condition = Object.keys(obj)[0] + ' = ' +  mysql.escape(obj[Object.keys(obj)[0]]);
    var sql = squel.select().from('device').where(condition);
    mysql.queryOne(sql.toString(), callback);
};

Device.create = function (device, callback) {
    var sql = squel.insert().into('device').setFields(device);
    mysql.query(sql.toString(), function (err, data) {
        if (!err) {
            Device.findById(data.insertId, callback);
        }
    });
};

Device.deleteById = function (id, callback) {
    var sql = squel.delete().from('device').where('id = ' + id);
    mysql.query(sql.toString(), callback);
};

Device.update = function (id, device, callback) {
    var sql = squel.update().table('device').setFields(device).where('id = ' + id);
    mysql.query(sql.toString(), function (err) {
        if (!err) {
            Device.findById(id, callback);
        }
    });
};

module.exports = Device;
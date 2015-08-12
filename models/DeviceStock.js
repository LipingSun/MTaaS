'use strict';

var mysql = require('./../services/mysql');
var squel = require('squel');

var DeviceStock = {};

DeviceStock.findAll = function (callback) {
    var sql = squel.select().from('device_stock');
    mysql.query(sql.toString(), callback);
};

DeviceStock.findById = function (imei, callback) {
    var sql = squel.select().from('device_stock').where('imei = ' + imei);
    mysql.queryOne(sql.toString(), callback);
};

DeviceStock.findOne = function (obj, callback) {
    var condition = Object.keys(obj)[0] + ' = ' +  mysql.escape(obj[Object.keys(obj)[0]]);
    var sql = squel.select().from('device_stock').where(condition);
    mysql.queryOne(sql.toString(), callback);
};

DeviceStock.create = function (device_stock, callback) {
    var sql = squel.insert().into('device_stock').setFields(device_stock).toString();
    mysql.query(sql, function (err, data) {
        if (!err) {
            device_stock.findById(data.insertId, callback);
        }
    });
};

DeviceStock.deleteById = function (imei, callback) {
    var sql = squel.delete().from('device_stock').where('imei = ' + imei);
    mysql.query(sql.toString(), callback);
};

DeviceStock.update = function (imei, device_stock, callback) {
    var sql = squel.update().table('device_stock').setFields(device_stock).where('imei = ' + imei);
    mysql.query(sql.toString(), function (err) {
        if (!err) {
            DeviceStock.findById(imei, callback);
        }
    });
};

module.exports = DeviceStock;
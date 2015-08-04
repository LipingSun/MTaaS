'use strict';

var mysql = require('./../services/mysql');
var squel = require('squel');

var ControllerHost = {};

ControllerHost.findAll = function (callback) {
    var sql = squel.select().from('controller_host').toString();
    mysql.query(sql, callback);
};

ControllerHost.findById = function (id, callback) {
    var sql = squel.select().from('controller_host').where('id = ' + id).toString();
    mysql.queryOne(sql, callback);
};

ControllerHost.findOne = function (obj, callback) {
    var condition = Object.keys(obj)[0] + ' = ' +  mysql.escape(obj[Object.keys(obj)[0]]);
    var sql = squel.select().from('controller_host').where(condition).toString();
    mysql.queryOne(sql, callback);
};

ControllerHost.create = function (controller_host, callback) {
    var sql = squel.insert().into('controller_host').setFields(controller_host).toString();
    mysql.query(sql, callback);
};

ControllerHost.deleteById = function (id, callback) {
    var sql = squel.delete().from('controller_host').where('id = ' + id).toString();
    mysql.query(sql, callback);
};

ControllerHost.update = function (id, controller_host, callback) {
    var sql = squel.update().table('controller_host').setFields(controller_host).where('id = ' + id).toString();
    mysql.query(sql, callback);
};

module.exports = ControllerHost;
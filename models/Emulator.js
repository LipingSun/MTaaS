'use strict';

var mysql = require('./../services/mysql');
var squel = require('squel');

var Emulator = {};

Emulator.findAll = function (callback) {
    var sql = squel.select().from('emulator').toString();
    mysql.query(sql, callback);
};

Emulator.findById = function (id, callback) {
    var sql = squel.select().from('emulator').where('id=' + id).toString();
    mysql.queryOne(sql, callback);
};

Emulator.findOne = function (obj, callback) {
    var condition = Object.keys(obj)[0] + '=' +  mysql.escape(obj[Object.keys(obj)[0]]);
    var sql = squel.select().from('emulator').where(condition).toString();
    mysql.queryOne(sql, callback);
};

Emulator.create = function (emulator, callback) {
    var sql = squel.insert().into('emulator').setFields(emulator).toString();
    mysql.query(sql, callback);
};

Emulator.deleteById = function (id, callback) {
    var sql = squel.delete().from('emulator').where('id=' + id).toString();
    mysql.query(sql, callback);
};

Emulator.update = function (emulator, callback) {
    var sql = squel.update().table('emulator').setFields(emulator).where('id=' + emulator.id);
    mysql.query(sql, callback);
};

module.exports = Emulator;
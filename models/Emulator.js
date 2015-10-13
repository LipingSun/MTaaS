'use strict';

var mysql = require('./../services/mysql');
var squel = require('squel');

var Emulator = {};

Emulator.findAll = function (callback) {
    var sql = squel.select().from('emulator');
    mysql.query(sql.toString(), callback);
};

Emulator.findAllByUserId = function (id, callback) {
    var sql = squel.select().from('emulator').where('user_id = ' + mysql.escape(id));
    mysql.query(sql.toString(), callback);
};

Emulator.findById = function (id, callback) {
    var sql = squel.select().from('emulator').where('id = ' + id);
    mysql.queryOne(sql.toString(), callback);
};

Emulator.findOne = function (obj, callback) {
    var condition = generateCondition(obj);
    var sql = squel.select().from('emulator').where(condition);
    mysql.queryOne(sql.toString(), callback);
};

Emulator.create = function (emulator, callback) {
    var sql = squel.insert().into('emulator').setFields(emulator).toString();
    mysql.query(sql, function (err, data) {
        if (!err) {
            Emulator.findById(data.insertId, callback);
        }
    });
};

Emulator.deleteById = function (id, callback) {
    var sql = squel.delete().from('emulator').where('id = ' + id);
    mysql.query(sql.toString(), callback);
};

Emulator.update = function (id, emulator, callback) {
    var sql = squel.update().table('emulator').setFields(emulator).where('id = ' + id);
    mysql.query(sql.toString(), function (err) {
        if (!err) {
            Emulator.findById(id, callback);
        }
    });
};

function generateCondition(filter) {
    if (!filter) {
        return '';
    }
    var condition = '';
    Object.keys(filter).forEach(function (key) {
        condition += key +  ' = ' + mysql.escape(filter[key]) + ' AND ';
    });
    condition = condition.slice(0, -5);
    return condition;
}

module.exports = Emulator;
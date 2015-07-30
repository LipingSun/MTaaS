'use strict';

var mysql = require('./../services/mysql');
var squel = require('squel');

var User = {};

User.findAll = function (callback) {
    var sql = squel.select().from('user').toString();
    mysql.query(sql, callback);
};

User.findById = function (id, callback) {
    var sql = squel.select().from('user').where('id=' + id).toString();
    mysql.queryOne(sql, callback);
};

User.findOne = function (obj, callback) {
    var condition = Object.keys(obj)[0] + '=' +  mysql.escape(obj[Object.keys(obj)[0]]);
    var sql = squel.select().from('user').where(condition).toString();
    mysql.queryOne(sql, callback);
};

User.create = function (user, callback) {
    var sql = squel.insert().into('user').setFields(user).toString();
    mysql.query(sql, callback);
};

User.deleteById = function (id, callback) {
    var sql = squel.delete().from('user').where('id=' + id).toString();
    mysql.query(sql, callback);
};

User.update = function (user, callback) {
    var sql = squel.update().table('user').setFields(user).where('id=' + user.id);
    mysql.query(sql, callback);
};

module.exports = User;
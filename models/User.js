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
    mysql.query(sql, callback);
};

User.findOne = function (obj, callback) {
    var condition = Object.keys(obj)[0] + '=' +  mysql.escape(obj[Object.keys(obj)[0]]);
    var sql = squel.select().from('user').where(condition).toString();
    mysql.query(sql, function (err, rows) {
        if (err) {
            callback(err);
        } else {
            callback(null, rows[0]);
        }
    });
};

User.create = function (user, callback) {
    var sql = squel.insert().into('user').setFields(user).toString();
    mysql.query(sql, callback);
};

User.deleteById = function () {

};

User.upsert = function () {

};

module.exports = User;
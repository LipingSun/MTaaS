'use strict';

var User = require('./../models/User');

var users = {};

users.getUsers = function (req, res) {
    User.findAll(function (err, data) {
        res.status(200).json(data);
    });
};

users.getUser = function (req, res) {
    if (req.params.id) {
        User.findById(req.params.id, function (err, data) {
            if (!err) {
                res.status(200).json(data);
            }
        });
    } else {
        res.status(500).json('Require id');
    }
};

users.updateUser = function (req, res) {
    User.update(req.params.id, req.body, function (err, data) {
        if (!err) {
            User.findById(req.params.id, function (err, data) {
                if (!err) {
                    res.status(201).json(data);
                }
            });
        }
    });
};

users.deleteUser = function (req, res) {
    User.deleteById(req.params.id, function (err, data) {
        if (!err) {
            res.status(200).json(data);
        }
    });
};

module.exports = users;
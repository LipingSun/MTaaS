'use strict';

var User = require('./../models/User');

var auth = {};

auth.getToken = function (req, res) {

};

auth.login = function (req, res) {
    res.json('login success');
};

auth.register = function (req, res) {
    User.create(req.body, function (err, data) {
        if (err) {
            res.status(500).send();
        } else {
            req.login({email: req.body.email, password: req.body.password}, function(err, next) {
                if (err) {
                    return next(err);
                } else {
                    return res.status(201).redirect('/');
                }
            });
        }
    });
};


auth.logout = function (req, res) {
    req.logout();
    res.json('logout success');
};

module.exports = auth;
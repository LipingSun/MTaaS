'use strict';

var User = require('./../models/User');
var passport = require('./../services/passport');

var auth = {};

auth.getToken = function (req, res) {

};

auth.login = function (req, res) {
    res.json('login success');
};

auth.register = function (req, res) {
    switch (req.body.bill_plan) {
        case "Pay AS Hour Go": req.body.bill_plan = "pay_as_hour_go"; break;
        case "Month Flat Rate": req.body.bill_plan = "month_flat_rate"; break;
    }
    var user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        type: "user",
        curr_plan: req.body.bill_plan,
        next_plan: req.body.bill_plan
    };

    User.create(user, function (err, data) {
        if (err) {
            res.status(500).json("The email is already used, please register with a different email.");
        } else {
            //req.login({email: req.body.email, password: req.body.password}, function(err, next) {
            //    if (err) {
            //        return next(err);
            //    } else {
            //        return res.status(201).redirect('/');
            //    }
            //});

            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        }
    });
};


auth.logout = function (req, res) {
    req.logout();
    res.status(200).redirect('/');
    //res.json('logout success');
};

module.exports = auth;
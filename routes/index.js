'use strict';

var routes = {};

routes.index = function (req, res) {
    res.render('index.html');
};

routes.login = function (req, res) {
    res.render('login.html');
};

routes.register = function (req, res) {
    res.render('register.html');
};

module.exports = routes;
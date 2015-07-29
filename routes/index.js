'use strict';

var routes = {};

routes.index = function (req, res) {
    if (req.user.type === 'admin') {
        res.render('admin.html');
    } else {
        res.render('home.html');
    }
};

routes.login = function (req, res) {
    res.render('login.html');
};

routes.register = function (req, res) {
    res.render('register.html');
};

module.exports = routes;
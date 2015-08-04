'use strict';

var request = require('request');

var controller = {};

controller.emulator = {

    getAll: function (addr, callback) {
        request.get(addr + '/emulators', function (err, res, body) {
            if (!err && res.statusCode == 200) {
                callback(null, body);
            } else {
                console.log(err);
                callback(err);
            }
        });
    },

    getById: function () { //TODO

    },

    launch: function (addr, emulator, callback) {
        request.post(addr + '/emulators', { json: emulator }, function (err, res, body) {
            if (!err && res.statusCode == 201) {
                callback(null, body);
            } else {
                console.log(err);
                callback(err);
            }
        });
    },

    update: function () { //TODO

    },

    terminate: function (addr, id, callback) {
        request.del(addr + '/emulators/' + id, function (err, res) {
            if (!err && res.statusCode == 200) {
                callback(null);
            } else {
                console.log(err);
                callback(err);
            }
        });
    }

};

controller.hub = {

    getAll: function (addr, callback) {
        request.get(addr + '/hubs', function (err, res, body) {
            if (!err && res.statusCode == 200) {
                callback(null, body);
            } else {
                console.log(err);
                callback(err);
            }
        });
    },

    getById: function () { //TODO

    },

    launch: function (addr, hub, callback) {
        request.post(addr + '/hubs', { json: hub }, function (err, res, body) {
            if (!err && res.statusCode == 201) {
                callback(null, body);
            } else {
                console.log(err);
                callback(err);
            }
        });
    },

    update: function () { //TODO

    },

    terminate: function (addr, id, callback) {
        request.del(addr + '/hubs/' + id, function (err, res) {
            if (!err && res.statusCode == 200) {
                callback(null);
            } else {
                console.log(err);
                callback(err);
            }
        });
    },

    attach: function (addr, hub_id, resource, callback) {
        request.post(addr + '/hubs/' + hub_id + '/connections', { json: resource }, function (err, res, body) {
            if (!err && res.statusCode == 201) {
                callback(null, body);
            } else {
                console.log(err);
                callback(err);
            }
        });
    }

};

module.exports = controller;
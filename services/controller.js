'use strict';

var request = require('request');

var controller = {};

controller.emulator = {

    getAll: function (addr, callback) {
        request.get(this.addr + '/emulators', function (err, res, body) {
            if (!err && res.statusCode == 200) {
                callback(body);
            } else {
                console.log(err);
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
        request.del(addr + '/emulators/' + Number(id), function (err, res) {
            if (!err && res.statusCode == 200) {
                callback();
            } else {
                console.log(err);
            }
        });
    }

};

controller.hub = {

    getAll: function (addr, callback) {
        request.get(this.addr + '/hubs', function (err, res, body) {
            if (!err && res.statusCode == 200) {
                callback(body);
            } else {
                console.log(err);
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
        request.del(addr + '/hubs/' + Number(id), function (err, res) {
            if (!err && res.statusCode == 200) {
                callback();
            } else {
                console.log(err);
            }
        });
    }

};

module.exports = controller;
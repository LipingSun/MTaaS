'use strict';

var request = require('request');

var controller = {};

controller.getEmulators = function (addr, callback) {
    request.get(this.addr + '/emulators', function (err, res, body) {
        if (!err && res.statusCode == 200) {
            callback(body);
        } else {
            console.log(err);
        }
    });
};

/*controller.getEmulator = function (addr) {
    if (req.params.id) {
        Emulator.findById(req.params.id, function (err, data) {
            if (!err) {
                res.status(200).json(data);
            }
        });
    } else {
        res.status(500).json('Require id');
    }
};*/

controller.launchEmulator = function (addr, emulator, callback) {
    request.post(addr + '/emulators', { json: emulator }, function (err, res, body) {
        if (!err && res.statusCode == 201) {
            callback(null, body);
        } else {
            console.log(err);
            callback(err);
        }
    });
};

/*controller.updateEmulator = function (addr) {
    Emulator.update(req.params.id, req.body, function (err, data) {
        if (!err) {
            Emulator.findById(req.params.id, function (err, data) {
                if (!err) {
                    res.status(201).json(data);
                }
            });
        }
    });
};*/

controller.terminateEmulator = function (addr, id, callback) {
    request.del(addr + '/emulators/' + Number(id), function (err, res) {
        if (!err && res.statusCode == 200) {
            callback();
        } else {
            console.log(err);
        }
    });
};

module.exports = controller;
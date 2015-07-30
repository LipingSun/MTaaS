'use strict';

var request = require('request');

var Emulator = require('./../models/Emulator');
var DeviceHost = require('./../models/DeviceHost');

var emulators = {};

emulators.getEmulators = function (req, res) {
    Emulator.findAll(function (err, data) {
        if (!err) {
            res.status(200).json(data);
        }
    });
};

emulators.getEmulator = function (req, res) {
    if (req.params.id) {
        Emulator.findById(req.params.id, function (err, data) {
            if (!err) {
                res.status(200).json(data);
            }
        });
    } else {
        res.status(500).json('Require id');
    }
};

emulators.launchEmulators = function (req, res) {
    //DeviceHost.findAll(function (err, data) {
    //    if (!err) {
    //        var deviceHost = data[0];
    //        //request.post();
    //    }
    //});


    req.body.status = 'processing';
    Emulator.create(req.body, function (err, data) {
        if (!err) {
            Emulator.findById(data.insertId, function (err, data) {
                if (!err) {
                    res.status(201).json(data);
                }
            });
        }
    });
};

emulators.updateEmulator = function (req, res) {
    Emulator.update(req.params.id, req.body, function (err, data) {
        if (!err) {
            Emulator.findById(req.params.id, function (err, data) {
                if (!err) {
                    res.status(201).json(data);
                }
            });
        }
    });
};

emulators.terminateEmulator = function (req, res) {
    Emulator.update(req.params.id, { status: 'terminated'}, function (err, data) {
        if (!err) {
            res.status(200).json(data);
        }
    });
};

module.exports = emulators;
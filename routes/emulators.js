'use strict';

var Emulator = require('./../models/Emulator');

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
    Emulator.create(req.body, function () {
        if (!err) {
            res.status(201).json(data);
        }
    });
};

emulators.updateEmulator = function (req, res) {
    Emulator.update(req.body, function () {
        if (!err) {
            res.status(201).json(data);
        }
    });
};

emulators.terminateEmulator = function (req, res) {
    var changes = {
        id: req.param.id,
        status: 'terminated'
    };
    Emulator.update(changes, function () {
        if (!err) {
            res.status(200).json(data);
        }
    });
};

module.exports = emulators;
'use strict';

var controller = require('./../services/controller');
var emulatorCtrl = require('./../services/emulatorController');
var Emulator = require('./../models/Emulator');
var ControllerHost = require('./../models/ControllerHost');
var squel = require('squel');

var emulators = {};

emulators.getEmulators = function (req, res) {
    Emulator.findAll(function (err, data) {
        if (!err) {
            if (req.user && req.user.type === 'user') {
                data = data.filter(function (emulator) {
                    return emulator.user_id === req.user.id && emulator.status !== 'terminated';
                });
            }
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

emulators.launchEmulators = function (req, res) {  // TODO: Multi-thread
    var number = req.body.number;
    var newEmulator = req.body;
    delete newEmulator.number;
    emulatorCtrl.launchEmulators(newEmulator, number, req.user.id, function (err, data) {
        if (!err) {
            res.status(201).json(data);
        } else {
            console.log(err);
            res.status(500);
        }
    });
};

emulators.updateEmulator = function (req, res) {
    Emulator.update(req.params.id, req.body, function (err, data) {
        if (!err) {
            res.status(201).json(data);
        }
    });
};

emulators.terminateEmulator = function (req, res) {
    var changes = {
        status: 'terminating',
        terminate_datetime: squel.fval('NOW()')
    };
    Emulator.update(req.params.id, changes, function (err, data) {
        if (!err) {
            res.status(200).json(data);

            ControllerHost.findOne({hostname: 'host101'}, function (err, controllerHost) {
                if (!err) {
                    var host = 'http://' + controllerHost.ip;
                    if (controllerHost.port) {
                        host += ':' + controllerHost.port;
                    }
                    controller.emulator.terminate(host, req.params.id, function (err) {
                        if (!err) {
                            Emulator.update(req.params.id, {status: 'terminated'});
                        }
                    });
                }
            });
        }
    });
};

module.exports = emulators;
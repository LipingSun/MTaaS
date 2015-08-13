'use strict';

var controller = require('./../services/controller');
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
    for (var i = 0; i < req.body.number; i++) {
        var newEmulator = req.body;
        newEmulator.status = 'processing';
        newEmulator.user_id = req.user.id;
        if (req.body.number > 1) newEmulator.name += '_' + (i + 1);
        delete newEmulator.number;
        Emulator.create(newEmulator, function (err, emulator) {
            if (!err) {
                ControllerHost.findOne({hostname: 'host101'}, function (err, controllerHost) {
                    if (!err) {
                        var host = 'http://' + controllerHost.ip;
                        if (controllerHost.port) {
                            host += ':' + controllerHost.port;
                        }
                        controller.emulator.launch(host, emulator, function (err, data) {
                            if (!err) {
                                var changes = {
                                    host_id: controllerHost.id,
                                    ip: controllerHost.ip,
                                    vnc_port: data.VNCPort,
                                    ssh_port: data.SSHPort,
                                    status: 'running'
                                };
                                Emulator.update(emulator.id, changes, function (err, data) {
                                    if (!err) {
                                        newEmulators.push(data);
                                        if (i === req.body.number - 1) res.status(201).json(newEmulators);
                                    }
                                });
                            } else {
                                var changes = {
                                    status: 'error'
                                };
                                Emulator.update(emulator.id, changes, function (err, data) {
                                    if (!err) {
                                        res.status(500).json(data);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
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
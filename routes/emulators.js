'use strict';

var controller = require('./../services/controller');
var Emulator = require('./../models/Emulator');
var DeviceHost = require('./../models/DeviceHost');

var emulators = {};

emulators.getEmulators = function (req, res) {// TODO
    Emulator.findAll(function (err, data) {
        if (!err) {
            if (req.user.type === 'user') {
                data = data.filter(function (emulator) {
                    return emulator.user_id === req.user.id && (emulator.status === 'running' || emulator.status === 'processing');
                });
            }
            res.status(200).json(data);
        }
    });
};

emulators.getEmulator = function (req, res) {// TODO
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
    for (var i = 1; i <= req.body.number; i++) {
        var newEmulator = req.body;
        newEmulator.status = 'processing';
        newEmulator.user_id = req.user.id;
        if (req.body.number > 1) newEmulator.name += '_' + i;
        delete newEmulator.number;
        Emulator.create(newEmulator, function (err, emulator) {
            if (!err) {
                DeviceHost.findOne({hostname: 'host1'} ,function (err, deviceHost) {
                    if (!err) {
                        var addr = 'http://' + deviceHost.ip;
                        if (deviceHost.port) {
                            addr += ':' + deviceHost.port;
                        }
                        emulator.id = Number(emulator.id);
                        controller.launchEmulator(addr, emulator, function (err, data) {
                            if (!err) {
                                var changes = {
                                    ip: deviceHost.ip,
                                    status: 'running'
                                };
                                if (data.VNCPort) changes.vnc_port =  data.VNCPort;
                                if (data.SSHPort) changes.ssh_port =  data.SSHPort;
                                Emulator.update(emulator.id, changes, function (err, data) {
                                    if (!err) {
                                        res.status(201).json(data);
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

emulators.updateEmulator = function (req, res) {// TODO
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
    DeviceHost.findOne({hostname: 'host1'} ,function (err, deviceHost) {
        if (!err) {
            var addr = 'http://' +  deviceHost.ip;
            if (deviceHost.port) {
                addr += ':' + deviceHost.port;
            }
            controller.terminateEmulator(addr, req.params.id, function () {
                var changes = {
                    status: 'terminated',
                    terminate_datetime: new Date().toISOString()
                };
                Emulator.update(req.params.id, changes, function (err, data) {
                    if (!err) {
                        res.status(200).json(data);
                    }
                });
            });
        }
    });
};

module.exports = emulators;
'use strict';

var emulatorCtrl = require('./../services/emulatorController');
var hubCtrl = require('./../services/hubController');

var infrastructure = {};

infrastructure.setup = function (req, res) {

    var hubPayload = {
        user: req.user,
        body: req.hub
    };
    var emulatorsPayload = {
        user: req.user,
        body: req.emulators
    };
    //
    //var newHub = hubs.launchHubs(hubPayload, function () {
    //    var newEmulators = emulators.launchEmulators(emulatorsPayload, function () {
    //        hubs.
    //    });
    //});

    // Launch hub
    var newHub = req.body.infrastructure.hub;
    newHub.status = 'processing';
    newHub.user_id = req.user.id;
    Hub.create(newHub, function (err, hub) {
        if (!err) {
            var host_id = '00000000001';
            ControllerHost.findById(host_id, function (err, controllerHost) {
                if (!err) {
                    var host = 'http://' + controllerHost.ip;
                    if (controllerHost.port) {
                        host += ':' + controllerHost.port;
                    }
                    controller.hub.launch(host, hub, function (err, data) {
                        if (!err) {
                            var changes = {
                                host_id: controllerHost.id,
                                status: 'running'
                            };
                            Hub.update(hub.id, changes, function (err, data) {
                                if (!err) {
                                    // Launch emulators
                                    for (var i = 1; i <= req.body.infrastructure.emulator.number; i++) {
                                        var newEmulator = req.body.infrastructure.emulator;
                                        newEmulator.status = 'processing';
                                        newEmulator.user_id = req.user.id;
                                        if (newEmulatorNum > 1) newEmulator.name += '_' + i;
                                        delete newEmulator.number;
                                        Emulator.create(newEmulator, function (err, emulator) {
                                            if (!err) {
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
                                                                // Attach emulators to hub
                                                                controller.hub.attach(host, hub.id, {resource_id: emulator.id, resource_type: 'emulator'}, function (err, data) {
                                                                    if (!err) {
                                                                        var changes = {
                                                                            hub_id: data.hub_id,
                                                                            hub_port: data.hub_port
                                                                        };
                                                                        Emulator.update(emulator.id, changes, function (err, data) {
                                                                            if (i === req.body.infrastructure.emulator.number)
                                                                                res.status(201);
                                                                        });
                                                                    }
                                                                });
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
                                }
                            });
                        }
                    });
                }
            });
        }
    });

};

module.exports = infrastructure;
'use strict';

var controller = require('./controller');
var Emulator = require('./../models/Emulator');
var ControllerHost = require('./../models/ControllerHost');

var emulatorCtrl = {};

emulatorCtrl.launchEmulators = function (newEmulator, number, user_id, callback) {  // TODO: Multi-thread
    var newEmulators = [];
    ControllerHost.findOne({hostname: 'sjsu-vm1'}, function (err, controllerHost) {
        if (!err) {
            var host = 'http://' + controllerHost.ip;
            if (controllerHost.port) host += ':' + controllerHost.port;

            for (var i = 0; i < number; i++) {
                newEmulator.status = 'processing';
                newEmulator.user_id = user_id;
                if (number > 1) newEmulator.name += '_' + (i + 1);
                Emulator.create(newEmulator, function (err, emulator) {
                    if (!err) {
                        newEmulators.push(emulator);
                        if (i === number) {
                            var completeEmulators = [];

                            newEmulators.forEach(function (emulator) {
                                controller.emulator.launch(host, emulator, function (controller_err, data) {
                                    if (!controller_err) {
                                        var changes = {
                                            host_id: controllerHost.id,
                                            ip: controllerHost.ip,
                                            vnc_port: data.VNCPort,
                                            ssh_port: data.SSHPort,
                                            status: 'running'
                                        };
                                        Emulator.update(emulator.id, changes, function (err, data) {
                                            if (!err) {
                                                completeEmulators.push(data);
                                                if (i === number - 1) callback(null, completeEmulators);
                                            }
                                        });
                                    } else {
                                        var changes = {
                                            status: 'error'
                                        };
                                        Emulator.update(emulator.id, changes, function (err, data) {
                                            if (!err) {
                                                callback(controller_err, null);
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    }
                });
            }
        }
    });
};


module.exports = emulatorCtrl;
'use strict';

var controller = require('./controller');
var Emulator = require('./../models/Emulator');
var ControllerHost = require('./../models/ControllerHost');

var emulatorCtrl = {};

emulatorCtrl.launchEmulators = function (newEmulator, number, user_id, callback) {
    ControllerHost.findOne({hostname: 'controller-01'}, function (err, controllerHost) {
        if (err) {
            callback(err);
        }
        var host = 'http://' + controllerHost.ip;
        if (controllerHost.port) {
            host += ':' + controllerHost.port;
        }

        var insertEmulator = {
            name: newEmulator.name,
            system: newEmulator.system,
            version: newEmulator.version,
            cpu: newEmulator.cpu,
            ram: newEmulator.ram,
            disk: newEmulator.disk,
            ip: controllerHost.ip,
            status: 'processing',
            user_id: user_id,
            host_id: controllerHost.id
        };

        Emulator.create(insertEmulator, function (err, emulator) {
            if (!err) {
                controller.emulator.launch(host, emulator, function (err, data) {
                    if (!err && data.VNCPort && data.SSHPort) {
                        var changes = {
                            vnc_port: data.VNCPort,
                            ssh_port: data.SSHPort,
                            status: 'running'
                        };
                        setTimeout(
                            Emulator.update(emulator.id, changes, function () {}),
                            1000 * 60 * 1
                        );
                        callback();

                    } else {
                        Emulator.update(emulator.id, {status: 'error'}, function () {});
                    }
                });
            }
        });
    });
};
//
//emulatorCtrl.launchEmulatorss = function (newEmulator, number, user_id, callback) {
//    ControllerHost.findOne({hostname: 'controller-01'}, function (err, controllerHost) {
//        if (err) {
//            callback(err);
//        }
//        var host = 'http://' + controllerHost.ip;
//        if (controllerHost.port) {
//            host += ':' + controllerHost.port;
//        }
//
//        newEmulator.status = 'processing';
//        newEmulator.user_id = user_id;
//        newEmulator.host_id = controllerHost.id;
//        newEmulator.ip = controllerHost.ip;
//
//        var newEmulators = [];
//        for (var i = 0; i < number; i++) {
//            if (number > 1) {
//                newEmulator.name += '_' + (i + 1);
//            }
//            newEmulators.push(newEmulator);
//        }
//
//        for (var j = 0; j < number; j++) {
//            Emulator.create(newEmulators[j], function (err, emulator) {
//                if (err) {
//                    callback(err);
//                }
//                controller.emulator.launch(host, emulator, function (err, data) {
//                    if (!err) {
//                        var changes = {
//                            vnc_port: data.VNCPort,
//                            ssh_port: data.SSHPort,
//                            status: 'running'
//                        };
//                        Emulator.update(emulator.id, changes, function (err, data) {
//                            if (err) {
//                                callback(err);
//                            }
//                            newEmulators[j] = data;
//                            if (j === number - 1) {
//                                callback(null, newEmulators);
//                            }
//                        });
//                    } else {
//                        Emulator.update(emulator.id, {status: 'error'}, function (err, data) {
//                            if (err) {
//                                callback(err, null);
//                            }
//                        });
//                    }
//                });
//            });
//        }
//
//    });
//
//};
//
//emulatorCtrl.launchEmulatorsss = function (newEmulator, number, user_id, callback) {  // TODO: Multi-thread
//    var newEmulators = [];
//    ControllerHost.findOne({hostname: 'controller-01'}, function (err, controllerHost) {
//        if (!err) {
//            var host = 'http://' + controllerHost.ip;
//            if (controllerHost.port) host += ':' + controllerHost.port;
//
//            for (var i = 0; i < number; i++) {
//                newEmulator.status = 'processing';
//                newEmulator.user_id = user_id;
//                if (number > 1) newEmulator.name += '_' + (i + 1);
//                Emulator.create(newEmulator, function (err, emulator) {
//                    if (!err) {
//                        newEmulators.push(emulator);
//                        if (i === number - 1) {
//                            var completeEmulators = [];
//
//                            for (var j = 0; j < number; j++) {
//                                controller.emulator.launch(host, newEmulators[j], function (controller_err, data) {
//                                    if (!controller_err) {
//                                        var changes = {
//                                            host_id: controllerHost.id,
//                                            ip: controllerHost.ip,
//                                            vnc_port: data.VNCPort,
//                                            ssh_port: data.SSHPort,
//                                            status: 'running'
//                                        };
//                                        Emulator.update(newEmulators[j].id, changes, function (err, data) {
//                                            if (!err) {
//                                                completeEmulators.push(data);
//                                                if (j === number) {
//                                                    callback(null, completeEmulators);
//                                                }
//                                            }
//                                        });
//                                    } else {
//                                        var changes = {
//                                            status: 'error'
//                                        };
//                                        Emulator.update(newEmulators[j].id, changes, function (err, data) {
//                                            if (!err) {
//                                                callback(controller_err, null);
//                                            }
//                                        });
//                                    }
//                                });
//                            }
//                        }
//                    }
//                });
//            }
//        }
//    });
//};


module.exports = emulatorCtrl;
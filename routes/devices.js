'use strict';

var controller = require('./../services/controller');
var Device = require('./../models/Device');
var DeviceStock = require('./../models/DeviceStock');
var ControllerHost = require('./../models/ControllerHost');
var squel = require('squel');

var devices = {};

devices.getDevices = function (req, res) {
    Device.findAll(function (err, data) {
        if (!err) {
            if (req.user && req.user.type === 'user') {
                data = data.filter(function (device) {
                    return device.user_id === req.user.id && (device.status === 'running' || device.status === 'processing' || device.status === 'error' );
                });
            }
            res.status(200).json(data);
        }
    });
};

devices.getDevice = function (req, res) {
    if (req.params.id) {
        Device.findById(req.params.id, function (err, data) {
            if (!err) {
                res.status(200).json(data);
            }
        });
    } else {
        res.status(500).json('Require id');
    }
};

devices.launchDevices = function (req, res) {  // TODO: Multi-thread
    var newDevice = req.body;
    newDevice.status = 'processing';
    newDevice.user_id = req.user.id;
    newDevice.model = newDevice.brand + '_' + newDevice.model;
    delete newDevice.brand;

    DeviceStock.update(newDevice.imei, {status: 'available'}, function (err) {
        if (!err) {
            Device.create(newDevice, function (err, device) {
                if (!err) {
                    ControllerHost.findOne({hostname: 'host101'}, function (err, controllerHost) {
                        if (!err) {
                            var host = 'http://' + controllerHost.ip;
                            if (controllerHost.port) {
                                host += ':' + controllerHost.port;
                            }
                            controller.device.launch(host, device, function (err, data) {
                                if (!err) {
                                    var changes = {
                                        host_id: controllerHost.id,
                                        ip: controllerHost.ip,
                                        vnc_port: data.VNCPort,
                                        ssh_port: data.SSHPort,
                                        status: 'running'
                                    };
                                    Device.update(device.id, changes, function (err, data) {
                                        if (!err) {
                                            res.status(201).json(data);
                                        }
                                    });
                                } else {
                                    var changes = {
                                        status: 'error'
                                    };
                                    Device.update(device.id, changes, function (err, data) {
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
    });
};

devices.updateDevice = function (req, res) {
    Device.update(req.params.id, req.body, function (err, data) {
        if (!err) {
            res.status(201).json(data);
        }
    });
};

devices.terminateDevice = function (req, res) {
    var changes = {
        status: 'terminating',
        terminate_datetime: squel.fval('NOW()')
    };

    Device.update(req.params.id, changes, function (err, data) {
        if (!err) {
            res.status(200).json(data);

            ControllerHost.findOne({hostname: 'host101'}, function (err, controllerHost) {
                if (!err) {
                    var host = 'http://' + controllerHost.ip;
                    if (controllerHost.port) {
                        host += ':' + controllerHost.port;
                    }
                    controller.device.terminate(host, req.params.id, function (err) {
                        if (!err) {
                            Device.update(req.params.id, {status: 'terminated'});
                            DeviceStock.update(data.imei, {status: 'available'});
                        }
                    });
                }
            });
        }
    });
};

module.exports = devices;
'use strict';

var Device = require('./../models/Device');
var squel = require('squel');

var device = {};

device.getDevices = function (req, res) {
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

device.getDevice = function (req, res) {
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

device.updateDevice = function (req, res, next) {
    console.log("device launch starts");
    var selectedDevice = req.body;
    if (selectedDevice.status === 'occupied') {
        var newDevice = {
            user_id: req.user.id,
            model: selectedDevice.spec.model,
            create_datetime: squel.fval('NOW()'),
            status: 'running',
            imei: selectedDevice.spec.imei
        };
        Device.create(newDevice, function (err, device) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log("insert into device success!");

            }
        });
    } else {
        var updateDevice = {
            terminate_datetime: squel.fval('NOW()'),
            status: 'terminated'
        };
        Device.update(selectedDevice.spec.imei, updateDevice, function (err, data) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log("delete device success!");
            }
        });
    }

    next();

};

module.exports = device;
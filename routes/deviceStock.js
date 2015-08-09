'use strict';

var DeviceStock = require('./../models/DeviceStock');
var squel = require('squel');

var deviceStock = {};

deviceStock.getDevices = function (req, res) {
    DeviceStock.findAll(function (err, data) {
        if (!err) {
            if (req.user && req.user.type === 'user') {
                data = data.filter(function (device) {
                    return device.status === 'available';
                });
            }
            res.status(200).json(data);
        }
    });
};

deviceStock.getDevice = function (req, res) {
    if (req.params.imei) {
        DeviceStock.findById(req.params.imei, function (err, data) {
            if (!err) {
                res.status(200).json(data);
            }
        });
    } else {
        res.status(500).json('Require IMEI');
    }
};

deviceStock.createDevice = function (req, res) {  // TODO:
};

deviceStock.updateDevice = function (req, res) {
    DeviceStock.update(req.params.imei, req.body, function (err, data) {
        if (!err) {
            res.status(201).json(data);
        }
    });
};

deviceStock.deleteDevice = function (req, res) { // TODO
};

module.exports = deviceStock;
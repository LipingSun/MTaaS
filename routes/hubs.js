'use strict';

var controller = require('./../services/controller');
var hubCtrl = require('./../services/hubController');
var Hub = require('./../models/Hub');
var ControllerHost = require('./../models/ControllerHost');
var squel = require('squel');

var hubs = {};

hubs.getHubs = function (req, res) {
    Hub.findAll(function (err, data) {
        if (!err) {
            if (req.user && req.user.type === 'user') {
                data = data.filter(function (hub) {
                    return hub.user_id === req.user.id && (hub.status === 'running' || hub.status === 'processing');
                });
            }
            res.status(200).json(data);
        }
    });
};

hubs.getHub = function (req, res) {
    if (req.params.id) {
        Hub.findById(req.params.id, function (err, data) {
            if (!err) {
                res.status(200).json(data);
            }
        });
    } else {
        res.status(500).json('Require id');
    }
};

hubs.launchHubs = function (req, res) {
    hubCtrl.launchHub(req.body, req.user.id, function (err, data) {
        if (!err) {
            res.status(201).json(data);
        } else {
            console.log(err);
            res.status(500);
        }
    });
};

hubs.updateHub = function (req, res) {
    Hub.update(req.params.id, req.body, function (err, data) {
        if (!err) {
            res.status(201).json(data);
        }
    });
};

hubs.terminateHub = function (req, res) {
    var changes = {
        status: 'terminating',
        terminate_datetime: squel.fval('NOW()')
    };
    Hub.update(req.params.id, changes, function (err, data) {
        if (!err) {
            res.status(200).json(data);

            ControllerHost.findOne({hostname: 'host101'}, function (err, controllerHost) {
                if (!err) {
                    var host = 'http://' + controllerHost.ip;
                    if (controllerHost.port) {
                        host += ':' + controllerHost.port;
                    }
                    controller.hub.terminate(host, req.params.id, function (err) {
                        if (!err) {
                            Hub.update(req.params.id, {status: 'terminated'});
                        } else {
                            Hub.update(req.params.id, {status: 'terminated Error'});
                        }
                    });
                }
            });
        }
    });
};

hubs.attach = function (req, res) {
    hubCtrl.attach(req.params.id, req.body, function (err, data) {
        if (!err) res.status(201).json(data);
    });
};

module.exports = hubs;
'use strict';

var controller = require('./../services/controller');
var Hub = require('./../models/Hub');
var DeviceHost = require('./../models/DeviceHost');

var hubs = {};

hubs.getHubs = function (req, res) {
    Hub.findAll(function (err, data) {
        if (!err) {
            if (req.user.type === 'user') {
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
    var newHub = req.body;
    newHub.status = 'processing';
    newHub.user_id = req.user.id;
    Hub.create(newHub, function (err, hub) {
        if (!err) {
            DeviceHost.findOne({hostname: 'host1'}, function (err, deviceHost) {
                if (!err) {
                    var host = 'http://' + deviceHost.ip;
                    if (deviceHost.port) {
                        host += ':' + deviceHost.port;
                    }
                    hub.id = Number(hub.id);
                    controller.hub.launch(host, hub, function (err, data) {
                        if (!err) {
                            var changes = {
                                status: 'running'
                            };
                            Hub.update(hub.id, changes, function (err, data) {
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
};

hubs.updateHub = function (req, res) {
    Hub.update(req.params.id, req.body, function (err, data) {
        if (!err) {
            res.status(201).json(data);
        }
    });
};

hubs.terminateHub = function (req, res) {
    DeviceHost.findOne({hostname: 'host1'}, function (err, deviceHost) {
        if (!err) {
            var host = 'http://' + deviceHost.ip;
            if (deviceHost.port) {
                host += ':' + deviceHost.port;
            }
            controller.hub.terminate(host, req.params.id, function () {
                var changes = {
                    status: 'terminated',
                    terminate_datetime: new Date().toISOString()
                };
                Hub.update(req.params.id, changes, function (err, data) {
                    if (!err) {
                        res.status(200).json(data);
                    }
                });
            });
        }
    });
};

module.exports = hubs;
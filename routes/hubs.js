'use strict';

var controller = require('./../services/controller');
var Hub = require('./../models/Hub');
var Emulator = require('./../models/Emulator');
var Device = require('./../models/Device');
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
    var newHub = req.body;
    newHub.status = 'processing';
    newHub.user_id = req.user.id;
    Hub.create(newHub, function (err, hub) {
        if (!err) {
            res.status(201).json(hub);
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
                        }
                    });
                }
            });
        }
    });
};

hubs.attach = function (req, res) {
    Hub.findById(req.params.id, function (err, hub) {
        if (!err) {
            ControllerHost.findById(hub.host_id , function (err, controllerHost) {
                var host = 'http://' + controllerHost.ip;
                if (controllerHost.port) {
                    host += ':' + controllerHost.port;
                }
                controller.hub.attach(host, hub.id, req.body, function (err, data) {
                   if (!err) {
                       switch (req.body.resource_type) {
                           case 'emulator':
                               var changes = {
                                   hub_id: data.hub_id,
                                   hub_port: data.hub_port
                               };
                               Emulator.update(req.body.resource_id, changes, function (err, data) {
                                   res.status(201).json(data);
                               });
                               break;
                           case 'device':
                               var changes = {
                                   hub_id: data.hub_id,
                                   hub_port: data.hub_port
                               };
                               Device.update(req.body.resource_id, changes, function (err, data) {
                                   res.status(201).json(data);
                               });
                               break;
                       }

                   }
                });
            });
        }
    });
};

module.exports = hubs;
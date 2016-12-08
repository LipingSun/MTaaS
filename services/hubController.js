'use strict';

var squel = require('squel');
var controller = require('./controller');
var Hub = require('./../models/Hub');
var Emulator = require('./../models/Emulator');
var Device = require('./../models/Device');
var ControllerHost = require('./../models/ControllerHost');

var hubCtrl = {};

hubCtrl.launchHub = function (newHub, user_id, callback) {  // TODO: Multi-thread
    newHub.user_id = user_id;
    newHub.status = 'running';
    newHub.create_datetime = squel.fval('NOW()');
    Hub.create(newHub, function () {});
};

// hubCtrl.launchHub = function (newHub, user_id, callback) {  // TODO: Multi-thread
//     newHub.user_id = user_id;
//     newHub.status = 'processing';
//     Hub.create(newHub, function (err, hub) {
//         if (!err) {
//             ControllerHost.findOne({hostname: 'controller-01'}, function (err, controllerHost) {
//                 if (!err) {
//                     var host = 'http://' + controllerHost.ip;
//                     if (controllerHost.port) {
//                         host += ':' + controllerHost.port;
//                     }
//                     controller.hub.launch(host, hub, function (err, data) {
//                         if (!err) {
//                             var changes = {
//                                 host_id: controllerHost.id,
//                                 status: 'running'
//                             };
//                             Hub.update(hub.id, changes, function (err, data) {
//                                 if (!err) {
//                                     callback(null,data);
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//         }
//     });
// };


hubCtrl.attach = function (hub_id, resource, callback) {
    Hub.findById(hub_id, function (err, hub) {
        if (!err) {
            ControllerHost.findOne({hostname: 'controller-01'}, function (err, controllerHost) {
                var host = 'http://' + controllerHost.ip;
                if (controllerHost.port) {
                    host += ':' + controllerHost.port;
                }
                controller.hub.attach(host, hub.id, resource, function (err, data) {
                    if (!err) {
                        var changes = {
                            hub_id: data.hub_id,
                            hub_port: data.hub_port
                        };
                        switch (resource.type) {
                            case 'emulator':
                                Emulator.update(resource.id, changes, function (err, data) {
                                    if (!err) callback(null, data);
                                });
                                break;
                            case 'device':
                                Device.update(resource.id, changes, function (err, data) {
                                    if (!err) callback(null, data);
                                });
                                break;
                        }
                    }
                });
            });
        }
    });
};


module.exports = hubCtrl;
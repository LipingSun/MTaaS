'use strict';

var emulatorCtrl = require('./../services/emulatorController');
var hubCtrl = require('./../services/hubController');

var infrastructure = {};

infrastructure.setup = function (req, res) {

    hubCtrl.launchHub(req.body.hub, req.user.id, function (err, newHub) {
        if (!err) {
            var number = req.body.emulators.number;
            var newEmulator = req.emulators;
            delete newEmulator.number;
            emulatorCtrl.launchEmulators(newEmulator, number, req.user.id, function (err, newEmulators) {
                if (!err) {
                    var resource = {
                        type: 'emulator'
                    };
                    newEmulators.forEach(function (emulator) {
                        resource.id = emulator.id;
                        hubCtrl.attach(newHub.id, resource, function (err, data) {
                            if (!err) res.status(201);
                        });
                    });
                } else {
                    console.log(err);
                    res.status(500);
                }
            });
        } else {
            console.log(err);
            res.status(500);
        }
    });

};

module.exports = infrastructure;
'use strict';

var squel = require('squel');
var router = require('express').Router();
var Hub = require('./../models/Hub');
var Device = require('./../models/Device');
var Emulator = require('./../models/Emulator');

router.put('/device/:id', function (req, res, next) {
    console.log("device update starts");
    var device = req.body;
    if (device.status === 'occupied') {
        var newDevice = {
            user_id: req.user.id,
            model: device.spec.model,
            create_datetime: squel.fval('NOW()'),
            status: 'running',
            imei: device.spec.imei
        };
        Device.create(newDevice, function (err, data) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log("insert into device success!");
                req.body.mysql_id = data.id;
                next();
            }
        });
    } else {
        var changes = {
            terminate_datetime: squel.fval('NOW()'),
            status: 'terminated'
        };
        Device.update(req.body.mysql_id, changes, function (err, data) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log("delete device success!");
                req.body.mysql_id = '';
                next();
            }
        });
    }
});

router.post('/emulator', function (req, res, next) {
    var newEmulator = {
        user_id: req.user.id,
        create_datetime: squel.fval('NOW()'),
        status: 'running'
    };
    Emulator.create(newEmulator, function (err, data) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("insert into emulator success!");
            req.body.mysql_id = data.id;
            next();
        }
    });
});

router.put('/emulator/:id', function (req, res, next) {
    var changes = {
        status: 'terminated',
        terminate_datetime: squel.fval('NOW()')
    };
    Emulator.update(req.body.mysql_id, changes, function (err, data) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("delete emulator success!");
            next();
        }
    });
});

router.post('/hub', function (req, res, next) {
    var newHub = {
        user_id: req.user.id,
        create_datetime: squel.fval('NOW()'),
        status: 'running'
    };
    Hub.create(newHub, function (err, data) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("insert into hub success!");
            req.body.mysql_id = data.id;
            next();
        }
    });
});

router.put('/hub/:id', function (req, res, next) {
    var changes = {
        status: 'terminated',
        terminate_datetime: squel.fval('NOW()')
    };
    Hub.update(req.body.mysql_id, changes, function (err, data) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("delete hub success!");
            next();
        }
    });
});


module.exports = router;
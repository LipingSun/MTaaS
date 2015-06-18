var request = require('request');
express = require('express');

var url = 'http://8.21.28.110:8888/emulator';

var emulator = {};

emulator.list = function (ip, next) {
    var url = 'http://' + ip + ':8888/emulator';
    request.get(url, function (error, response, body) {
        if (!error) {
            console.log('Response Code: ' + response.statusCode);
            if (response.statusCode == 200) {
                console.log('emulators: ' + body.toString());

            } else {
                console.log("Create emulator fail");
            }
            next(null, body);
        } else {
            next(error, null);
            console.log('Error: ' + error);
        }
    });
};

emulator.read = function (ip, id, next) {
    var url = 'http://' + ip + ':8888/emulator';
    request.get(url + '?id=' + id, function (error, response, body) {
        if (!error) {
            console.log('Response code: ' + response.statusCode);
            if (response.statusCode == 200) {
                console.log('emulator: ' + body.toString());
            } else {
                console.log("No emulator found");
            }
            next(null, body);
        } else {
            next(error, null);
            console.log('Error: ' + error);
        }
    });
};

emulator.create = function (ip, id, next) {
    request.post(url, {body: {'id': Number(id)}, json: true}, function (error, response, body) {
        if (!error) {
            console.log('Response code: ' + response.statusCode);
            if (response.statusCode == 200) {
                console.log('emulator: ' + JSON.stringify(body));
            } else {
                console.log("emulator create fail");
            }
            next(null, body);
        } else {
            next(error, null);

            console.log('Error: ' + error);
        }
    });
};

emulator.delete = function (ip, id, next) {
    request.del(url, {body: {'id': Number(id)}, json: true}, function (error, response, body) {
        if (!error) {
            console.log('Response code: ' + response.statusCode);
            if (response.statusCode == 200) {
                console.log('emulator deleted');
            } else {
                body = "No emulator found";
            }
            next(null, body);
        } else {
            next(error, null);
            console.log('Error: ' + error);
        }
    });
};

module.exports = emulator;
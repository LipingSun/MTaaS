var http = require('http');

var number = -1;

var sleep = function (time, callback) {
    var stop = new Date().getTime();
    while (new Date().getTime() < stop + time) {
        ;
    }
    callback();
};

var getToken = function (token, next) {
    var postData = JSON.stringify({
        "auth": {
            "tenantName": "facebook100006758537716",
            "passwordCredentials": {
                "username": "facebook100006758537716",
                "password": "qdNbRht81s7GV53q"
            }
        }
    });
    var options = {
        hostname: '8.21.28.222',
        port: 5000,
        path: '/v2.0/tokens',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    var req = http.request(options, function (res) {

        res.setEncoding('utf8');
        var response = '';
        res.on("data", function (data) {
            response += data;
        });
        res.on('end', function () {
            console.log('Authentication: ' + res.statusCode);
            // console.log('HEADERS: ' + JSON.stringify(res.headers));
            // console.log(JSON.parse(response).access.token.id);
            //return JSON.parse(response).access.token.id;
            next(JSON.parse(response).access.token.id, allocateFloatingIP);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.end(postData);
    //req.end();
};

var getFloatingIPNumber = function (token, next) {
    var options = {
        hostname: '8.21.28.222',
        port: 8774,
        path: '/v2/f7dbed5da28846a485b21b2befc6d972/os-floating-ips',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': token
        }
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var response = '';
        res.on("data", function (data) {
            response += data;
        });
        res.on('end', function () {
            number = JSON.parse(response).floating_ips.length;
            console.log('Has IPs Number: ' + number);
            //if (number < 4) {
            //    next(token, allocateFloatingIP);
            //}
            return number;
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
};

var allocateFloatingIP = function (token, next) {
    var postData = JSON.stringify({
        "pool": "external"
    });
    var options = {
        hostname: '8.21.28.222',
        port: 8774,
        path: '/v2/f7dbed5da28846a485b21b2befc6d972/os-floating-ips',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': token
        }
    };
    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var response = '';
        res.on("data", function (data) {
            response += data;
        });
        res.on('end', function () {
            console.log(new Date().toLocaleString() + ' - Allocate IP: ' + res.statusCode);
            return res.statusCode;
            // console.log(response);
            //if (res.statusCode == 404) {
            //    //sleep(1000, function () {
            //    //    next(token, allocateFloatingIP);
            //    //});
            //    setInterval(function () {
            //        next(token, allocateFloatingIP);
            //    }, 1000);
            //} else {
            //    if (res.statusCode == 401) {
            //        next(token, getToken);
            //    } else {
            //        next(token, getFloatingIPNumber);
            //    }
            //}
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    // write data to request body
    req.end(postData);
    //req.end();
};

var showIPNumber = function (req, res) {
    res.json(number);
};

var start = function () {
    var token = getToken();
    if (getFloatingIPNumber(token) < 4) {
        setInterval(function () {
            if (number < 4) {
                var resCode = allocateFloatingIP(token);
                if ( resCode=== 401) {
                    token =getToken();
                } else {
                    if (resCode === 200 || 201) {
                        number++;
                    }
                }
            }


            if (allocateFloatingIP(token) === 401) {
                token = getToken();
            }
        }, 1000);
    }
};



module.exports.start = start;
module.exports.number = showIPNumber;
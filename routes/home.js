var ejs = require("ejs");
var mysql = require('./mysql');
var connpool = require('./dbConnection/sqlConn');
var query = require('./dbConnection/sqlQuery');
var emulator = require('./emulator');
var host = '8.21.28.110';

function afterSignIn(req, res) {
    var sqlStr = "select * from user where username=? and password=?";
    console.log("Query is:" + sqlStr);

    var params = [req.param('username'), req.param('password')];
    console.log(req.param('username') + req.param('password'));
    query.execQuery(sqlStr, params, function (err, rows) {

        console.log(rows.length);
        if (rows.length !== 0) {
            //var firstname;
            //var lastname;
            if (rows[0].user_type == 0) {

                res.json({usermode: 'normal'});

            } else {
                res.json({usermode: 'admin'});
            }
            console.log("rows: " + rows[0].username);
            req.session.user_id = rows[0].id;
            req.session.username = rows[0].username;


        } else {
            //res.send({'errorMessage': "Please enter a valid email and password"});
            console.log("no such user");
            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
        }
    });
}

function launch(req, res) {
    //var mobile=req.param('mobile');
    var sqlStr = "Insert into request (`user_id`, `version`, `cpu`, `ram`, `disk`,`number`) VALUES (?,?,?,?,?,?)";
    console.log("Query is:" + sqlStr);
    //for(var p in mobile)
    //consloe.log(p+": "+mobile[p]);
    var params = [req.session.user_id, req.param('version'), req.param('cpu'), req.param('ram'), req.param('disk'), req.param('number')];

    query.execQuery(sqlStr, params, function (err, rows) {
        if (err) {
            //res.send({'errorMessage': "Please enster a valid email and password"});
            console.log("ERROR: " + err.message);
            //res.render({errorMessage: 'Sign Up Fail!'});

        } else {
            for (var i = 0; i < req.param('number'); i++) {
                var sqlStr = "Insert into emulator (`user_id`, `version`, `cpu`, `ram`, `disk`) VALUES (?,?,?,?,?)";
                console.log("Query is:" + sqlStr);

                var params = [req.session.user_id, req.param('version'), req.param('cpu'), req.param('ram'), req.param('disk')];
                query.execQuery(sqlStr, params, function (err, rows) {
                    if (err) {
                        //res.send({'errorMessage': "Please enter a valid email and password"});
                        console.log("ERROR: " + err.message);
                        //res.render({errorMessage: 'Sign Up Fail!'});

                    } else {
                        console.log(rows.insertId);
                        emulator.create(host, rows.insertId, function (err, data) {
                            if (!err) {
                                console.log(data.port);
                                var ip_port = host+": " + data.port;
                                var sqlStr = "update emulator set ip_port=?, start_time=?, status=? where id=?";
                                console.log("Query is:" + sqlStr);

                                var params = [ip_port, new Date(), 'run', rows.insertId];
                                query.execQuery(sqlStr, params, function (err, rows) {
                                    if (err) {
                                        //res.send({'errorMessage': "Please enter a valid email and password"});
                                        console.log("ERROR: " + err.message);
                                        //res.render({errorMessage: 'Sign Up Fail!'});

                                    } else {
                                        res.json({"launchStatus": 'Success'});
                                        console.log('Success');
                                    }
                                });
                            } else {
                                console.log('Error: ' + error);
                            }
                        });
                        console.log(i + " mobile launched");
                    }
                });
            }

        }
    });

    sqlStr = "update instance set emulator_number=(emulator_number+?) where ip=?";
    console.log("Query is:" + sqlStr);
    params = [req.param('number'), host];

    query.execQuery(sqlStr, params, function (err, rows) {
        if (!err) {
            console.log("Sucess");
        }
        else
            console.log("fail");
    });

}


function terminateEmulator(req, res) {
    var end_time = new Date();
    console.log("id" + req.param('id') + " endtime" + end_time);


    emulator.delete(req.body.ip, req.body.id, function () {
        var sqlStr = "update emulator t set t.end_time=?,status='terminated' where id=?";

        var params = [end_time, req.param('id')];
        query.execQuery(sqlStr, params, function (err, rows) {
            if (err) {
                //res.send({'errorMessage': "Please enster a valid email and password"});
                console.log("ERROR: " + err.message);
                //res.render({errorMessage: 'Sign Up Fail!'});

            } else {
                var sqlStr = "update emulator t set t.cost=((select b.price from billingrule b where b.resource=t.cpu)+(select b.price from billingrule b where b.resource='ram')*t.ram+(select b.price from billingrule b where b.resource='disk')*t.disk)*TIMESTAMPDIFF(MINUTE,t.start_time,t.end_time) where id=?";
                var params = [req.param('id')];
                query.execQuery(sqlStr, params, function (err, rows) {
                    if (err) {
                        //res.send({'errorMessage': "Please enster a valid email and password"});
                        console.log("ERROR: " + err.message);
                        //res.render({errorMessage: 'Sign Up Fail!'});

                    } else {
                        res.json({"terminateStatus": 'Success'});
                        console.log('Success');

                    }
                });
            }
        });

        sqlStr = "update instance set emulator_number=(emulator_number-1) where ip=?";
        console.log("Query is:" + sqlStr);
        params = [req.param('ip')];

        query.execQuery(sqlStr, params, function (err, rows) {
            if (!err) {
                console.log("Sucess");
            }
            else
                console.log("fail");
        });
    });
}

function emulators(req, res) {
    var sqlStr = "select emulator.id, username, version, cpu, ram, disk, TIMESTAMPDIFF(MINUTE,start_time,end_time) AS runtime, ip_port, status from user, emulator where user.id=emulator.user_id";
    console.log("Query is:" + sqlStr);

    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {

        console.log(rows.length);
        if (rows.length !== 0) {

            res.json({'emulators': rows});

        } else {
            //res.send({'errorMessage': "Please enter a valid email and password"});
            console.log("no emulators");
            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
        }
    });

}

function usage(req, res) {

    var sqlStr = "update emulator set end_time=? where status='run'";

    var params = [new Date()];
    query.execQuery(sqlStr, params, function (err, rows) {
        if (err) {
            //res.send({'errorMessage': "Please enster a valid email and password"});
            console.log("ERROR: " + err.message);
            //res.render({errorMessage: 'Sign Up Fail!'});

        } else {
            console.log("end time updated");
            var sqlStr = "update emulator t set t.cost=((select b.price from billingrule b where b.resource=t.cpu)+(select b.price from billingrule b where b.resource='ram')*t.ram+(select b.price from billingrule b where b.resource='disk')*t.disk)*TIMESTAMPDIFF(MINUTE,t.start_time,t.end_time) where status='run'";

            var params = [];
            query.execQuery(sqlStr, params, function (err, rows) {
                if (err) {
                    //res.send({'errorMessage': "Please enster a valid email and password"});
                    console.log("ERROR: " + err.message);
                    //res.render({errorMessage: 'Sign Up Fail!'});

                } else {
                    var sqlStr = "SELECT u.id, u.username, count(r.ram) as number, sum(r.ram) as totalram, sum(r.disk) as totaldisk,sum(TIMESTAMPDIFF(MINUTE,r.start_time,r.end_time)) as runtime,sum(r.cost) as totalcost from user u left join emulator r on u.id=r.user_id group by u.username";
                    console.log("Query is:" + sqlStr);

                    var params = [];
                    query.execQuery(sqlStr, params, function (err, rows) {

                        console.log(rows.length);
                        if (rows.length !== 0) {

                            res.json({'usage': rows});

                        } else {
                            //res.send({'errorMessage': "Please enter a valid email and password"});
                            console.log("no usages");
                            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
                        }
                    });
                }
            });
        }

    });
}

function usageDetail(req, res) {

    var sqlStr = "SELECT id, version,cpu,ram,disk,TIMESTAMPDIFF(MINUTE,start_time,end_time) as runtime,cost,status,ip_port from emulator where user_id=?";
    console.log("Query is:" + sqlStr);

    var params = [req.param('user_id')];
    query.execQuery(sqlStr, params, function (err, rows) {

        console.log(rows.length);
        if (rows.length !== 0) {


            res.json({'usage': rows});


        } else {
            res.json({'usage': 'null'});
            //res.send({'errorMessage': "Please enter a valid email and password"});
            console.log("no usage");
            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
        }
    });
}

function bill(req, res) {

    var sqlStr = "update emulator set end_time=? where status=? and user_id=?";

    var params = [new Date(), 'run', req.session.user_id];
    query.execQuery(sqlStr, params, function (err, rows) {
        if (err) {
            //res.send({'errorMessage': "Please enster a valid email and password"});
            console.log("ERROR: " + err.message);
            //res.render({errorMessage: 'Sign Up Fail!'});

        } else {
            console.log("end time updated");
            var sqlStr = "update emulator t set t.cost=((select b.price from billingrule b where b.resource=t.cpu)+(select b.price from billingrule b where b.resource='ram')*t.ram+(select b.price from billingrule b where b.resource='disk')*t.disk)*TIMESTAMPDIFF(MINUTE,t.start_time,t.end_time) where t.user_id=?";

            var params = [req.session.user_id];
            query.execQuery(sqlStr, params, function (err, rows) {
                if (err) {
                    //res.send({'errorMessage': "Please enster a valid email and password"});
                    console.log("ERROR: " + err.message);
                    //res.render({errorMessage: 'Sign Up Fail!'});

                } else {
                    var sqlStr = "SELECT id, version,cpu,ram,disk,TIMESTAMPDIFF(MINUTE,start_time,end_time) as runtime,cost,status from emulator where user_id=?";
                    console.log("Query is:" + sqlStr);

                    var params = [req.session.user_id];
                    query.execQuery(sqlStr, params, function (err, rows) {

                        console.log(rows.length);
                        if (rows.length !== 0) {
                            var sqlStr = "SELECT sum(cost) as totalcost from emulator where user_id=?";
                            console.log("Query is:" + sqlStr);
                            var bills = rows;
                            var params = [req.session.user_id];
                            query.execQuery(sqlStr, params, function (err, rows) {

                                console.log(rows.length);
                                if (rows.length !== 0) {

                                    res.json({'bills': bills, 'totalcost': rows[0].totalcost});

                                } else {
                                    //res.send({'errorMessage': "Please enter a valid email and password"});
                                    console.log("no bills");
                                    //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
                                }
                            });

                        } else {
                            //res.send({'errorMessage': "Please enter a valid email and password"});
                            console.log("no bills");
                            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
                        }
                    });
                }
            });
        }

    });

}

function afterSignUp(req, res) {
    var user = req.param('account');
    for (p in user)
        console.log(user[p]);
    var sqlStr = "Insert into user (`user_type`, `username`,`password`, `first_name`, `last_name`, `email`) VALUES (?,?,?,?,?,?)";
    console.log("Query is:" + sqlStr);

    params = [0, user.username, user.password, user.firstname, user.lastname, user.email];
    query.execQuery(sqlStr, params, function (err, rows) {
        if (err) {
            //res.send({'errorMessage': "Please enster a valid email and password"});
            console.log("ERROR: " + err.message);
            //res.render({errorMessage: 'Sign Up Fail!'});

        } else {
            res.json({'signup': 'Success'});

        }
    });

}

function loadPipData(req, res) {
    var sqlStr = "SELECT * from instance";
    console.log("Query is:" + sqlStr);

    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {

        console.log(rows.length);
        if (rows.length !== 0) {


            res.json({'pip': rows});


        } else {
            res.json({'pip': 'null'});
            //res.send({'errorMessage': "Please enter a valid email and password"});
            console.log("no instance");
            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
        }
    });
}

function userEmulator(req, res) {
    var sqlStr = "select id, version, cpu, ram,disk, start_time, ip_port from emulator where user_id=? and status=?";
    console.log("Query is:" + sqlStr);

    var params = [req.session.user_id, "run"];
    query.execQuery(sqlStr, params, function (err, rows) {

        console.log(rows.length);
        if (rows.length !== 0) {
            res.json({'emulators': rows});
        } else {
            //res.send({'errorMessage': "Please enter a valid email and password"});
            console.log("no requests");
            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
        }
    });
}

function request(req, res) {
    var sqlStr = "select id, user_id, version, cpu, ram, disk, number from request";
    console.log("Query is:" + sqlStr);

    var params = [];
    query.execQuery(sqlStr, params, function (err, rows) {

        console.log(rows.length);
        if (rows.length !== 0) {

            res.json({'requests': rows});

        } else {
            //res.send({'errorMessage': "Please enter a valid email and password"});
            console.log("no requests");
            //res.render('signin', {errorMessage: 'Please enter a valid email and password'});
        }
    });

}


exports.afterSignIn = afterSignIn;
exports.launch = launch;
exports.emulators = emulators;
exports.afterSignUp = afterSignUp;
exports.usage = usage;
exports.usageDetail = usageDetail;
exports.bill = bill;
exports.loadPipData = loadPipData;
exports.userEmulator = userEmulator;
exports.terminateEmulator = terminateEmulator;
exports.request = request;

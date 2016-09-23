'use strict';

var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var mers = require('mers');

const API_V1 = '/api/v1';
const API_V2 = '/api/v2';
var mysql = require('./services/mysql');
var passport = require('./services/passport');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var infrastructure = require('./routes/infrastructure');
var emulators = require('./routes/emulators');
var devices = require('./routes/devices');
var deviceStock = require('./routes/deviceStock');
var hubs = require('./routes/hubs');
var users = require('./routes/users');
var bills = require('./routes/bills');
var DevicePool = require('./models/DevicePool');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'mtaas',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// MongoDB for DevicePool
mongoose.connect(process.env.MONGODB_URI);
app.use(API_V2, mers({mongoose: mongoose}).rest());

app.use(function (req, res, next) {
    if (req.params && Object.keys(req.params).length  > 0) {
        console.log('Request params: ' + JSON.stringify(req.params));
    }
    if (req.body && Object.keys(req.body).length  > 0) {
        console.log('Request body: ' + JSON.stringify(req.body));
    }
    next();
});

// Routes
app.get('/', passport.ensureAuthenticated, routes.index);  // Get index page
app.get('/login', routes.login);  // Get login page
app.get('/register', routes.register);  // Get register page

// Authentication
//app.get(api_v1 + '/auth/token', auth.getToken);  // Get user token
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}));  // Post login info
app.post('/register', auth.register);  // Post register info
app.all('/logout', auth.logout);  // Log out user session


// Infrastructure
app.post(API_V1 + '/infrastructure', infrastructure.setup);  // Setup infrastructure

// Emulators
app.get(API_V1 + '/emulators', passport.ensureAuthenticated, emulators.getEmulators);  // Get all relevant emulators
app.post(API_V1 + '/emulators', passport.ensureAuthenticated, emulators.launchEmulators);  // Launch an emulator
app.get(API_V1 + '/emulators/:id', passport.ensureAuthenticated, emulators.getEmulator);  // Get info of an emulator
app.patch(API_V1 + '/emulators/:id', passport.ensureAuthenticated, emulators.updateEmulator);  // Update info of an emulator
app.delete(API_V1 + '/emulators/:id', passport.ensureAuthenticated, emulators.terminateEmulator);  // Terminate an emulator

//Devices
app.get(API_V1 + '/devices', passport.ensureAuthenticated, devices.getDevices);  // Get all relevant devices
app.post(API_V1 + '/devices', passport.ensureAuthenticated, devices.launchDevices);  // Launch an device
app.get(API_V1 + '/devices/:id', passport.ensureAuthenticated, devices.getDevice);  // Get info of an device
app.patch(API_V1 + '/devices/:id', passport.ensureAuthenticated, devices.updateDevice);  // Update info of an device
app.delete(API_V1 + '/devices/:id', passport.ensureAuthenticated, devices.terminateDevice);  // Terminate an device

//Devices in Stock
app.get(API_V1 + '/devices-in-stock', deviceStock.getDevices);  // Get all relevant devices
app.get(API_V1 + '/devices-in-stock/:id', deviceStock.getDevice);  // Get info of an devices
app.patch(API_V1 + '/devices-in-stock/:id', deviceStock.updateDevice);  // Update info of an devices

// Hubs
app.get(API_V1 + '/hubs', passport.ensureAuthenticated, hubs.getHubs);  // Get all relevant hubs
app.post(API_V1 + '/hubs', passport.ensureAuthenticated, hubs.launchHubs);  // Launch an hub
app.get(API_V1 + '/hubs/:id', passport.ensureAuthenticated, hubs.getHub);  // Get info of an hub
app.patch(API_V1 + '/hubs/:id', passport.ensureAuthenticated, hubs.updateHub);  // Update info of an hub
app.delete(API_V1 + '/hubs/:id', passport.ensureAuthenticated, hubs.terminateHub);  // Terminate an hub
app.post(API_V1 + '/hubs/:id/connections', passport.ensureAuthenticated, hubs.attach);  // attach emulator or device to hub


// Users
app.get(API_V1 + '/users', users.getUsers);  // Get all relevant users
//app.post(api_v1 + '/users', users.createUser);  // Create a user
app.get(API_V1 + '/users/:id', users.getUser);  // Get info of a user
app.patch(API_V1 + '/users/:id', users.updateUser);  // Update info of a user
app.delete(API_V1 + '/users/:id', users.deleteUser);  // Delete an user

//// Bills
//app.get(api_v1 + '/bills', bills.getBills);
//app.get(api_v1 + '/bills/:bill_id', bills.getBill);
app.get(API_V1 +'/bill_plan', bills.getBillPlan);
app.post(API_V1 +'/change_bill_plan', bills.changeBillPlan);
app.get(API_V1 +'/realTimeBills', bills.getRealTimeBills);
app.get(API_V1 + '/createBills', bills.createBills);
app.get(API_V1 + '/bills', bills.getMonthBills);
app.get(API_V1 + '/availBillDates', bills.getAvailDateList);
app.get(API_V1 + '/unpaid_bills', bills.getUnpaidBills);
app.post(API_V1 + '/paybills', bills.payBills);


//// System Info
//app.get('requests', system.getRequests);


app.get(API_V1 + '/check_db', function (req, res) {
    mysql.query('show tables', function (err, data) {
        res.status(200).json(data);
    });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
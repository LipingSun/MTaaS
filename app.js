var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/routes');
var auth = require('./routes/authentication');
var emulators = require('./routes/emulators');

var mysql = require('./routes/mysql');

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

// Routes
app.get('/', routes.index);  // Get index page
app.get('/login', routes.login);  // Get login page
app.get('/register', routes.register);  // Get register page

// Authentication
app.get('/auth/token', auth.getToken);  // Get user token
app.post('/auth/register', auth.register);  // Post register info
app.post('/auth/login', auth.login);  // Post login info
app.delete('/auth/logout', auth.logout);  // Delete user session

// Emulators
app.get('/emulators', emulators.getEmulators);  // Get all relevant emulators
app.post('/emulators', emulators.launchEmulators);  // Launch an emulator
app.get('/emulators/:emulator_id', emulators.getEmulator);  // Get info of an emulator
app.put('/emulators/:emulator_id', emulators.updateEmulator);  // Update info of an emulator
app.delete('/emulators/:emulator_id', emulators.terminateEmulator);  // Terminate an emulator

// Users
app.get('/users', function (req, res) {
    res.send([ { "id": "12345678", "type": "admin", "email": "abc@abc.com", "first_name": "Scott", "last_name": " Tian" }, { "id": "23456789", "type": "user", "email": "abdfsc@cdsa.com", "first_name": "Kim", "last_name": " Steven" } ]);
});

//// Bills
//app.get('/bills', bills.getbills);
//app.get('/bills/bill_id', bills.getbill);
//
//// System Info
//app.get('requests', system.getRequests);



app.use('/mysql', function (req, res) {
    var conn = mysql.getConnectionPool();
    conn.query('show tables', function (err, data) {
        res.send(data);
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
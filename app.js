var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

const api_v1 = '/api/v1';
var mysql = require('./services/mysql');
var passport = require('./services/passport');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var emulators = require('./routes/emulators');
var bills = require('./routes/bills');

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
    cookie: { maxAge: 15 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Routes
app.get('/', passport.ensureAuthenticated, routes.index);  // Get index page
app.get('/login', routes.login);  // Get login page
app.get('/register', routes.register);  // Get register page

// Authentication
//app.get(api_v1 + '/auth/token', auth.getToken);  // Get user token
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login'}));  // Post login info
app.post('/register', auth.register);  // Post register info
app.all('/logout', auth.logout);  // Log out user session

// Emulators
app.get(api_v1 + '/emulators', emulators.getEmulators);  // Get all relevant emulators
app.post(api_v1 + '/emulators', emulators.launchEmulators);  // Launch an emulator
app.get(api_v1 + '/emulators/:id', emulators.getEmulator);  // Get info of an emulator
app.patch(api_v1 + '/emulators/:id', emulators.updateEmulator);  // Update info of an emulator
app.delete(api_v1 + '/emulators/:id', emulators.terminateEmulator);  // Terminate an emulator

// Users
app.get(api_v1 + '/users', function (req, res) {
    res.send([ { "id": "12345678", "type": "admin", "email": "abc@abc.com", "first_name": "Scott", "last_name": " Tian" }, { "id": "23456789", "type": "user", "email": "abdfsc@cdsa.com", "first_name": "Kim", "last_name": " Steven" } ]);
});

//// Bills
//app.get(api_v1 + '/bills', bills.getBills);
//app.get(api_v1 + '/bills/:bill_id', bills.getBill);
app.get(api_v1 +'/bill_plan', bills.getBillPlan);


//// System Info
//app.get('requests', system.getRequests);


app.get(api_v1 + '/check_db', function (req, res) {
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
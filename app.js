/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path')
    , home = require('./routes/home')
    , emulator = require('./routes/emulator')
    , autoIP = require('./routes/autoIP');

var app = express();

app.set('ip', process.env.OPENSHIFT_NODEJS_IP);
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 3000);

// all environments
//app.set('port', process.env.PORT || 3000);
//app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
//app.set('ip', process.env.OPENSHIFT_NODEJS_IP);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: 'xDDFsdfddsdfSDdbg', cookie: {maxAge: null}}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', function (req, res) {
    res.render('login');
});
app.get('/ips', autoIP.number);
app.get('/dashboard', function (req, res) {
    res.render('Dashboard');
});
app.get('/signin', home.afterSignIn);
app.post('/signup', home.afterSignUp);

app.get('/bill', home.bill);
app.get('/usage', home.usage);
app.get('/request', home.request);
app.get('/emulators', home.emulators);
app.get('/loadPipData', home.loadPipData);
app.get('/usageDetail', home.usageDetail);
app.get('/userEmulator', home.userEmulator);

app.post('/launch', home.launch);
app.post('/terminateEmulator', home.terminateEmulator);

app.use('/emulator', emulator);

http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//autoIP.start();
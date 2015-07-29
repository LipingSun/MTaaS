var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./../models/User');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        User.findOne({email: email}, function (err, user) {
            if (err) {
                return done({message: "Error"});
            }
            if (!user) {
                return done(null, false, {message: 'Incorrect email.'});
            }
            if (user.password !== password) {
                return done(null, false, {message: 'Incorrect password.'});
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function(email, done) {
    User.findOne({email: email}, function (err, data) {
        if (err) {
            console.log(err);
            done(err, null);
        } else {
            done(null, data);
        }
    });
});

passport.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/login');
    }
};

module.exports = passport;
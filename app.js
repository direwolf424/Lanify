var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var routes = require('./routes/index');
var users = require('./routes/users');
var db = require('./routes/db');
var album = require('./routes/album');
var artist = require('./routes/artist');
var search = require('./routes/search');
var request = require('./routes/request');
var playlist = require('./routes/playlist');
var update = require('./routes/update');
var register = require('./routes/register');
var user = require('./model/user').user;
var tags = require('./routes/tags');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var app = express();
var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

//mongoose.connect('mongodb://localhost/music');
mongoose.createConnection('mongodb://localhost/music');

passport.use('login', new LocalStrategy({
   passReqToCallback : true
},
function(req, username, password, done) { 
   // check in mongo if a user with username exists or not
   user.findOne({ 'username' :  username }, 
                function(err, user) {
                   // In case of any error, return using the done method
                   if (err)
                      return done(err);
                   //Username does not exist, log error & redirect back
                   if (!user){
                      console.log('User Not Found with username '+username);
                      return done(null, false, 
                                  req.flash('message', 'User Not found.'));                 
                   }
                   // User exists but wrong password, log the error 
                   //if (!isValidPassword(user, password)){
                   if ((!user.validPassword(password))){
                      console.log('Invalid Password');
                      return done(null, false, 
                                  req.flash('message', 'Invalid Password'));
                   }
                   //User and password both match, return user from 
                   //done method which will be treated like success
                   console.log('------>>',user);
                   return done(null, user);
                }
               );
}));
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
   console.log('serializeing--------',user);
   done(null, user);
});

passport.deserializeUser(function(id, done) {
   //done(null,id);
   user.findById(id, function(err, user) {
      done(err, user);
   });
});
//req.login(user, function(err) {
//if (err) { return next(err); }
//return res.redirect('/users/' + req.user.username);
//});


app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(express.static('public'));
app.use(express.static('/myfile/dc/lanify'));
//app.use(express.static('E://Music//Music World'));

//app.use('/', routes);
app.use(new RegExp('^\/album\/.*$'), album);
app.use(new RegExp('^\/artist\/.*$'), artist);
app.use(new RegExp('^\/users\/.*$'), users);
app.use(new RegExp('^\/update\/.*$'), update);
app.use(new RegExp('^\/tags\/.*$'), tags);
app.use(new RegExp('^\/playlist\/.*$'), playlist);
app.use('/request',request);
app.use('/lanify',db.Route);
app.use('/search',search);
app.use('/register',register);

var isAuthenticated = function (req, res, next) {
   if (req.isAuthenticated())
      return next();
   res.redirect('/db');
};

//req.login(user, function(err) {
//if (err) { return next(err); }
//return res.redirect('/users/' + req.user.username);
//});

app.get('/db',function(req,res){
   res.redirect('/lanify');
});
app.get('/logout', function(req, res){
   console.log('loggggggggggggggggggggggggggggggggggggggggggggggggggiinggn');
   req.logout();
   res.redirect('/db');
});
//app.get('/login',function(req,res,next){
//if(!req.user)
//res.render('login');
//else
//res.redirect('/db');
//});
app.post('/login',
         passport.authenticate('login'),
         function(req, res,next) {
            // If this function gets called, authentication was successful.
            // `req.user` contains the authenticated user.
            console.log('User logged in successfully');
            res.redirect('/db');
         });

         // catch 404 and forward to error handler
         app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
         });

         // error handlers

         // development* error handler
         // will print stacktrace
         if (app.get('env') === 'development') {
            app.use(function(err, req, res, next) {
               res.status(err.status || 500);
               res.render('error', {
                  message: err.message,
                  error: err
               });
            });
         }

         // production error handler
         // no stacktraces leaked to user
         app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
               message: err.message,
               error: {}
            });
         });


         module.exports = app;

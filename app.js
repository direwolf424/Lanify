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
var update = require('./routes/update');
var mongoose = require('mongoose');
var app = express();
var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

//mongoose.connect('mongodb://localhost/music');
passport.use(new LocalStrategy(
   function(username, password, done) {
      //User.findOne({ username: username }, function (err, user) {
      //if (err) { return done(err); }
      //if (!user) {
      //return done(null, false, { message: 'Incorrect username.' });
      //}
      //if (!user.validPassword(password)) {
      //return done(null, false, { message: 'Incorrect password.' });
      //}
      //return done(null, user);
      //});
      if(username == password){
         return done(null,username);
      }
      else{
         return done(null,false);
      }
   }
));

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
   done(null, user);
});

passport.deserializeUser(function(id, done) {
   done(null,id);
   //User.findById(id, function(err, user) {
      //done(err, user);
   //});
});
//req.login(user, function(err) {
     //if (err) { return next(err); }
       //return res.redirect('/users/' + req.user.username);
//});

app.get('/logout', function(req, res){
     req.logout();
       res.redirect('/');
});

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
app.use(new RegExp('^\/update\/.*$'), update);

app.use(express.static('public'));
app.use(express.static('/myfile/dc/lanify'));

//app.use('/', routes);
app.use(new RegExp('^\/album\/.*$'), album);
app.use(new RegExp('^\/artist\/.*$'), artist);
app.use(new RegExp('^\/users\/.*$'), users);
app.use('/db',db.Route);
app.use('/search',search);

app.get('/login',function(req,res,next){
   console.log('---------------->',req.username);
   res.render('login');
});
app.post('/login',
         passport.authenticate('local', { successRedirect: '/db',
                               failureRedirect: '/login'
                               })
        );

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

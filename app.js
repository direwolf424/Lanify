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
var rate_playlist = require('./routes/rate_playlist');
var update = require('./routes/update');
var admin = require('./routes/admin');
var register = require('./routes/register');
var user = require('./model/user').user;
var tags = require('./routes/tags');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var app = express();
var passport = require('passport');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var LocalStrategy = require('passport-local').Strategy;

var connection = mongoose.createConnection('mongodb://localhost/music');

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
      //console.log('------>>',user);
      return done(null, user);
   }
   );
}));
app.use(cookieParser());

app.use(session({
   secret:'secret',
   maxAge: new Date(Date.now() + 3600000),
   store: new MongoStore({ mongooseConnection: connection })
}));
//app.use(expressSession({ secret: 'my secret', cookie: { maxAge : 1200000 } }));  
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
   console.log('serializeing--------',user);
   done(null, user._id);
});

passport.deserializeUser(function(id, done) {
   user.findById(id, function(err, user) {
      done(err, user);
   });
});


app.use(cors());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
app.use('/lanify/admin',admin);
app.use('/rate_playlist',rate_playlist);

var isAuthenticated = function (req, res, next) {
   if (req.isAuthenticated())
      return next();
   res.redirect('/lanify');
};


app.get('/db',function(req,res){
   res.redirect('/lanify');
});
app.get('/',function(req,res){
   res.redirect('/lanify');
});
app.get('/logout', function(req, res){
   console.log('LogOut');
   res.clearCookie('remember_me',{path: '/lanify'});
   req.logout();
   res.redirect('/lanify');
});


var tokens = {};

function findById(id, fn) {
   user.findOne({ '_id' :  id }, 
      function(err, user) {
      // In case of any error, return using the done method
      if (err)
         fn(new Error('User ' + id + ' does not exist'));
      //Username does not exist, log error & redirect back
      if (!user){
         console.log('User Not Found with user_id '+id);
         fn(new Error('User ' + id + ' does not exist'));
      }
      //User and password both match, return user from 
      //done method which will be treated like success
      //console.log('------>>',user);
      fn(null, user);
   }
   );
}
function findByUsername(username, fn) {
   user.findOne({ 'username' :  username }, 
      function(err, user) {
      // In case of any error, return using the done method
      if (err)
         return fn(null, null);
      //Username does not exist, log error & redirect back
      if (!user){
         console.log('User Not Found with username '+username);
         return fn(null, null);
      }
      //User and password both match, return user from 
      //done method which will be treated like success
      //console.log('------>>',user);
      return fn(null, user);
   }
   );
}
app.post('/login', 
   passport.authenticate('login',{ failureRedirect: '/lanify', failureFlash: true }),
   function(req, res, next) {
   // issue a remember me cookie if the option was checked
   console.log('yeahhhhhhhhhhhhhhhh  ',req.body.remember_me);
   if (req.body.remember_me == 'false') {
      console.log('remember_me ',req.body.remember_me);
      return next(); }

   //res.status(200).cookie('remember_me', token, { path: '/lanify', httpOnly: true, maxAge: 604800000 });
   return next();
},
function(req, res) {
   //console.log('User logged in successfully');
   res.redirect('/lanify');
});

app.get('/status',function(req,res,next){
   if(req.user)
      res.send('true');
   else
      res.send('false');
});

app.get('/status1',function(req,res,next){
   if(req.user){
      user.findOne({ '_id' :  req.user._id }, 
         function(err, user) {
         if(err)
            console.log(err);
         if(user.admin_rights){
            console.log('he has admin rights');
            res.send('true');
         }
         else{
            console.log('no admin rights');
            res.send('false');
         }
      });
   }
   else
      res.send('false');
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
   res.render('error1', {
      message: err.message,
      error: {}
   });
});


module.exports = app;

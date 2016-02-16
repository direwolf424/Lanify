var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var isValidPassword = function(user, password){
   return bCrypt.compareSync(password, user.password);
};

passport.use('login', new LocalStrategy({
   passReqToCallback : true
},
function(req, username, password, done) { 
   // check in mongo if a user with username exists or not
   User.findOne({ 'username' :  username }, 
                function(err, user) {
                   // In case of any error, return using the done method
                   if (err)
                      return done(err);
                   // Username does not exist, log error & redirect back
                   if (!user){
                      console.log('User Not Found with username '+username);
                      return done(null, false, 
                                  req.flash('message', 'User Not found.'));                 
                   }
                   // User exists but wrong password, log the error 
                   if (!isValidPassword(user, password)){
                      console.log('Invalid Password');
                      return done(null, false, 
                                  req.flash('message', 'Invalid Password'));
                   }
                   // User and password both match, return user from 
                   // done method which will be treated like success
                   return done(null, user);
                }
               );
}));
var isAuthenticated = function (req, res, next) {
   // if user is authenticated in the session, call the next() to call the next request handler 
   // Passport adds this method to request object. A middleware is allowed to add properties to
   // request and response objects
   if (req.isAuthenticated())
      return next();
   // if the user is not authenticated then redirect him to the login page
   res.redirect('/');
};

module.exports = function(passport){

   /* GET login page. */
   router.get('/', function(req, res) {
      // Display the Login page with any flash message, if any
      res.render('login', { message: req.flash('message') });
   });

   /* Handle Login POST */
   router.post('/login', passport.authenticate('login', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash : true  
   }));

   /* GET Registration Page */
   router.get('/signup', function(req, res){
      res.render('register',{message: req.flash('message')});
   });

   /* Handle Registration POST */
   router.post('/signup', passport.authenticate('signup', {
      successRedirect: '/home',
      failureRedirect: '/signup',
      failureFlash : true  
   }));

   /* GET Home Page */
   router.get('/home', isAuthenticated, function(req, res){
      res.render('home', { user: req.user });
   });

   /* Handle Logout */
   router.get('/signout', function(req, res) {
      req.logout();
      res.redirect('/');
   });

   return router;
};

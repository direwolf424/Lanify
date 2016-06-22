var mongoose = require('mongoose');
var fs = require('fs');
var pa = require('path');
var id3 = require('id3js');
var Sync = require('sync');
var Song = require('../model/songs').Song;
var express = require('express');
var router = express.Router();
mongoose.connect('mongodb://localhost/music');
   var path,songs_all,albums,album_arts,name;

var isAuthenticated = function (req, res, next) {
   if (req.user)
      return next();
   res.redirect('/login');
};
Song.find({}).sort({views: -1}).limit(16).exec(function(err, songs) {
   if (err) throw err;
   songs_all = songs;
});


Song.collection.distinct("album_art", function(err, results){
   if (err) throw err;
   album_arts = results;
});

Song.collection.distinct("album", function(err, results){
   if (err) throw err;
   albums = results;
});

Song.collection.distinct("artist", function(err, results){
   if (err) throw err;
   artist = results;
});
/* GET home page. */
router.get('/',function(req, res, next) {
   //console.log('------------------------------------------>>>>>>>>',req.ip);
   //console.log('------------------------',req.user);
   if(req.user){
      res.render('db', {username:req.user.username,songs:songs_all, artists:artist ,dirname:__dirname,albums:albums,album_arts:album_arts,message:'' });
   }
   else{
      res.render('db', {username:'',songs:songs_all, artists:artist ,dirname:__dirname,albums:albums,album_arts:album_arts,message:'' });
   }
});

module.exports.Route = router;

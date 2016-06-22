var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db = require('../model/songs').Song;
mongoose.createConnection('mongodb://localhost/music');
   var path,songs_all,albums,album_arts;

router.get('/', function(req, res, next) {

   var x =decodeURIComponent(req.originalUrl);
   x= x.substr(7, x.length-7);

   var finishRequest = function() {
      //        res.render('album', {artist:x,title:"Title", songs: songs_all });
      res.json(songs_all);
   };

   // first query
   var q1 = function(fn) {
      db.find({"album":x}, function(err, songs) {
         if (err) throw err;
         songs_all = songs;
         return fn && fn(null,songs_all);
      });
   };


   //Standard nested callbacks
   q1(function (err, result) {
      if (err)
         throw err;
      finishRequest(result);
   });

});

module.exports = router;

// the schema is useless so far
// we need to create a model using it

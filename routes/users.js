var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db = require('./db').Song;
mongoose.createConnection('mongodb://localhost/music');
var path,album,album_arts,artist,songs;

router.get('/',function(req,res,next){

  var x =decodeURIComponent(req.originalUrl);
  x= x.substr(7, x.length-7);
  console.log(x);

    var result=[];
    var finishRequest = function() {
      res.send(result);
    };



    var q1 = function(fn) {
      db.collection.distinct("album", function(err, results){
        if (err) throw err;
        album = results;
        return fn && fn(null,album);
      });
    };

    var q2 = function(fn) {
      db.collection.distinct("album_art", function(err, results){
        if (err) throw err;
        album_arts = results;
        return fn && fn(null,album_arts);
      });
    };

    var q3 = function(fn) {
      db.collection.distinct("artist", function(err, results){
        if (err) throw err;
        artist = results;
        return fn && fn(null,artist);
      });
    };

  var q4 = function(fn) {
    db.find({}).sort({views: -1}).exec(function(err, results) {
      if (err) throw err;
      songs = results;
      return fn && fn(null,songs);
    });
  };

    //Standard nested callbacks

    /*
      db.update({"title":x},{$inc:{views:1}}, function(err, songs) {
        if (err) throw err;
        console.log("Updated");
      });
    */
  if(x=="album")
  {
    q1(function (err, albums) {
      if (err)
        throw err;
      result.push(albums);
      q2(function(err,album_art){
        if(err)
          throw err;
        result.push(album_art);
        finishRequest(result);
      });
    });
  }
  else if(x=="artists")
  {
    q3(function (err, artist) {
      if (err)
        throw err;
      result.push(artist);
        finishRequest(result);
    });
  }
  else if(x=="songs")
  {
    q4(function (err, songs) {
      if (err)
        throw err;
      result.push(songs);
      finishRequest(result);
    });
  }

});

module.exports = router;
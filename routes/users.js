var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db = require('./db').Song;
mongoose.createConnection('mongodb://localhost/music');
var path,album,artist,songs;

router.get('/',function(req,res,next){

   var x =decodeURIComponent(req.originalUrl);
   var lang,group;
   x= x.substr(7, x.length-7);
   var result=[];
   var finishRequest = function() {
      res.send(result);
   };




   var q1 = function(fn) {
      db.collection.group(group.key,group.cond,group.initial,group.reduce,group.finalise,true,function(err,results) {
         if (err) throw err;
         //console.log(results);
         album = results;
         return fn && fn(null,album);
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

   if(x == "album")
      {
         group =  {
            key:{'album':1,'album_art':1},
            reduce : function (a) {},
            initial : {},
            cond: {},
            finalise : {}
         };
         q1(function (err, albums) {
            if (err)
               throw err;
            result.push(albums);
            finishRequest(result);
         });
      }
   else if(x.indexOf("album")>-1)
      {
         lang=x.substr(6,x.length-6);
         group =  {
            key:{'album':1,'album_art':1},
            reduce : function (a) {},
            initial : {},
            cond: {language:lang},
            finalise : {}
         };
         q1(function (err, albums) {
            if (err)
               throw err;
            result.push(albums);
            finishRequest(result);
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

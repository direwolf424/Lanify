
var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var db = require('../model/songs');

function buildResultSet(docs) {
   var result = [];
   for(var object in docs){
      result.push(docs[object]);
   }
   return result;
}


router.get('/',function(req,res,next){
   var songs,albums,artists;
   var result=[];
   var x = req.query['term'];
   x=x.trim();
   var finishRequest = function(result){
      res.send(result,{ 'Content-Type' : 'application/json' } ,200);
   };
   var q1=function(fn){
      db.Song.find({title: {'$regex':x,$options: 'i'}}).limit(7).exec(function(err,users){
         if(err) throw err;
         songs = buildResultSet(users);
         return fn && fn(null,songs);
      });
   };

   var q2=function(fn){
      db.Song.collection.distinct("album",{album: {'$regex':x,$options: 'i'} } , { limit: 5 } ,function(err, results){
         if (err) throw err;
         albums = buildResultSet(results);
         return fn && fn(null,albums);
      });
   };
   var q3=function(fn){
      db.Song.collection.distinct("artist",{artist: {'$regex':x,$options: 'i'} }, { limit: 5 } , function(err, results){
         if (err) throw err;
         artists = buildResultSet(results);
         return fn && fn(null,artists);
      });
   };
   q1(function(err,songs){
      if(err)
         throw err;
      //      console.log("songs",songs);
      result.push(songs);
      q2(function(err,albums){
         if(err)
            throw err;
         //         console.log("albums",albums);
         result.push(albums);
         q3(function(err,artist){
            if(err)
               throw err;
            //            console.log("artist",artist);
            result.push(artist);
            finishRequest(result);
         });
      });
   });
});

module.exports = router;

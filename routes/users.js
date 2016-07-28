var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db = require('../model/songs').Song;
mongoose.createConnection('mongodb://localhost/music');
var path,album,artist,songs;

router.get('/',function(req,res,next){

   var x =decodeURIComponent(req.originalUrl);
   console.log('>>>>>>>>>>>>>>>>>>>>>>',x);
   var lang,group,cnt_doc;
   if(req.query.flag == "random")
      x="songs";
   else 
      x= x.substr(7, x.length-7);
   var result=[];
   var finishRequest = function() {
      res.send(result);
   };
   var char;
   var q1 = function(fn) {
      db.collection.group(group.key,group.cond,group.initial,group.reduce,group.finalise,true,function(err,results) {
         if (err) throw err;
         //console.log(results);
         album = results;
         return fn && fn(null,album);
      });
   };

   var q3 = function(fn) {
      db.collection.distinct("artist",function(err, results){
         if (err) throw err;
         artist = results;
         return fn && fn(null,artist);
      });
   };

   var q4 = function(fn) {
      db.find({}).sort({views: -1}).limit(2000).exec(function(err, results) {
         if (err) throw err;
         songs = results;
         return fn && fn(null,songs);
      });
   };

   var q5 = function(fn) {
      //var mx = db.count();
      //console.log("songs in db are ",mx);
      var rndm = Math.floor((Math.random() * 10000) + 1);
      db.find({}).limit(150).skip(rndm).exec(function(err,results){
         //db.find({}).sort({views: -1}).limit(2000).exec(function(err, results) {
         //console.log('hahahaha ',results);
         if (err) throw err;
         songs = results;
         return fn && fn(null,songs);
      });
   };
   var q6 = function(fn){
      db.count({}, function(err, count){
         console.log( "Number of docs: ", count );
         return fn && fn(null,count);
      });
   };
   var q7 = function(fn) {
      db.find().sort({lastModified: -1}).limit(200).exec(function(err, results) {
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
      console.log('there ',req.query.flag);
      if(req.query.flag == "random" && req.query.value=="new"){
         console.log("hello");
         q7(function (err, songs) {
            if (err)
               throw err;
            result.push(songs);
            finishRequest(result);
         });
      }
      else if(req.query.flag == "random"){
         console.log("hello");
         q6(function(err,cnt){
            if(err)
               console.log("error in taking out count of documents ",err);
            cnt_doc = cnt;
            q5(function (err, songs) {
               if (err)
                  throw err;
               //res.json(songs);
               result.push(songs);
               finishRequest(result);
            });
         });
      }
      else{
         q4(function (err, songs) {
            if (err)
               throw err;
            result.push(songs);
            finishRequest(result);
         });
      }
   }
});

module.exports = router;

var Playlist = require('../model/playlist').Playlist;
var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var playlist = require('../model/playlist').Playlist;
var songs = require('../model/songs').Song;
mongoose.createConnection('mongodb://localhost/music');
var path,album,artist,songs;


router.get('/',function(req,res,next){

   var x =decodeURIComponent(req.originalUrl);
   console.log(x);
   if(req.user){
      console.log('hello');
      if(req.query.flag=='new'){
         var p_name = req.query.name;
         //console.log("------"+p_name);
         var s_id = req.query.song;
         //console.log("*****"+name);
         var q1 = function(variable) {
            var ct = variable;
            playlist.update({"name":ct,"user_name":req.user.username}, {$addToSet:{"song_id":s_id}}, {upsert:true,new:true}, function(err, ip1) {
               if (err) console.log(err);
               console.log("Updated");
            });
         };
         q1(p_name);
         res.send('');
      }
      else if(req.query.flag=='fetch'){
         console.log('hellllllllll');
         var q2 = function(fn){
            playlist.find({"user_name":req.user.username}).exec(function(err,plist){
               if(err)
                  console.log('Error occured',err);
               console.log('Playlist ----------------------->',req.user.username);
               return fn && fn(null,plist);
            });
         };
         q2(function(err,play){
            if(err)
               console.log(err);
            console.log(play);
            res.send(play);
         });
      }
      else if(req.query.flag=='songs'){
         console.log(req.query.flag);
         console.log(req.query.name);
         var the_id;
         var q3 = function(fn){
            playlist.find({"user_name":req.user.username,"name":req.query.name}).exec(function(err,plist){
               if(err)
                  console.log('Error occured',err);
               return fn && fn(null,plist);
            });
         };
         var q4 = function(){
            songs.findById(the_id).exec(function(err,song){
               if(err)
                  console.log('Error occured',err);
               return song; 
            });
         };
         q3(function(err,play){
            if(err)
               console.log(err);
            songs.find({
               '_id': { $in: play[0].song_id}
            }, function(err, docs){
               console.log(docs);

               res.send(docs);
            });
         });
      }
      else if(req.query.flag=='userlist'){
         var q5 = function(fn){
            playlist.find({"user_name":req.user.username},{name:1,_id:0}).exec(function(err,ulist){
               if(err)
                  console.log('error occured');
               return fn && fn(null,ulist);
            });
         };
         q5(function(err,ulist){
            if(err)
               console.log('error occured in retrieving playlist');
            console.log('the f playlists '+ulist);
            res.send(ulist);
         });
      }
   }
   else{
      res.send('0');
   }
});

module.exports = router;

var Playlist = require('../model/playlist').Playlist;
var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var playlist = require('../model/playlist').Playlist;
var dplaylist = require('../model/default_playlist').Playlist_default;
var songs = require('../model/songs').Song;
mongoose.createConnection('mongodb://localhost/music');
var path,album,artist,songs;


router.get('/',function(req,res,next){
   var x =decodeURIComponent(req.originalUrl);
   console.log(x);
   if(req.query.flag=='fetch' && req.query.share=="true"){
      var q21 = function(fn){
         playlist.find( {shared:true} ).exec(function(err,plist){
            if(err)
               console.log('Error occured',err);
            return fn && fn(null,plist);
         });
      };
      q21(function(err,play){
         if(err)
            console.log(err);
         res.send(play);
      });
   }
   else if(req.user){
      if(req.query.flag=='new' ){
         var p_name = req.query.value;
         var s_id = req.query.song;
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
      else if(req.query.flag == 'remove'){
         //console.log(req.query);
         var id = req.query.id;
         var pname = req.query.pname;
         var q11= function() {
            console.log('executing ');
            playlist.update(
               {user_name:req.user.username , name:pname},
               {$pull: { song_id: id } },
               {'new': true },function(err,rem){
                  if(err)
                     console.log("error while removing song from playlist");
                  console.log("song removed succesfully");
               });
         };
         q11();
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
         var f_def = function(play){
            dplaylist.find({"user_name":req.user.username}).exec(function(err,plist){
               if(err)
                  console.log(err);
               var new_plist=plist.concat(play);
               res.send(new_plist);
            });
         };
         q2(function(err,play){
            if(err)
               console.log(err);
            //console.log(play);
           f_def(play);
            //res.send(play);
         });
      }
      else if(req.query.flag=='default_playlist'){
         console.log('hellllllllll default');
         var sid = req.query.song; 
         var default_playlist = function(uname) {
            var ct = 'Top 100 Songs';
            dplaylist.update({"name":ct,"user_name":uname},
               //{$addToSet:{"song":{"song_id":sid,count:0},$slice:100 }},
               {$addToSet:{"song":sid,$slice:100 }},
               {upsert:true,new:true}, function(err, result) {
               if (err) console.log(err);
               console.log("Updated");

               dplaylist.update({"name":ct,"user_name":uname},
                  {$push:{"song":{$each:[],$slice:100 }}},
                  {upsert:true,new:true}, function(err, result) {
                  if(err)
                     console.log('error in slicing');
                  res.status(200).send('');
               });
            });
         };
         default_playlist(req.user.username);
      }
      else if(req.query.flag=='songs'){
         var q3 = function(fn){
            playlist.find({"name":req.query.name}).exec(function(err,plist){
               if(err)
                  console.log('Error occured',err);
               //console.log(plist);
               return fn && fn(null,plist);
            });
         };
         q3(function(err,play){
            if(err)
               console.log(err);
            songs.find({
               '_id': { $in: play[0].song_id}
            }, function(err, docs){
               //console.log(docs);

               res.send(docs);
            });
         });
      }
      else if(req.query.flag=='auto_songs'){
         var q3 = function(fn){
            dplaylist.find({"name":req.query.name,user_name:req.user.username}).exec(function(err,plist){
               if(err)
                  console.log('Error occured',err);
               //console.log(plist);
               return fn && fn(null,plist);
            });
         };
         q3(function(err,play){
            if(err)
               console.log(err);
            songs.find({
               '_id': { $in: play[0].song}
            }, function(err, docs){
               //console.log(docs);

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
            //console.log('the f playlists '+ulist);
            res.send(ulist);
         });
      }
      else if(req.query.flag =='share'){
         var on_off = req.query.sw;
         var pname = req.query.pname;
         if(on_off){
            //console.log(on_off);
            var q12= function() {
               console.log('executing shareable');
               playlist.update(
                  {user_name:req.user.username , name:pname},
                  {shared:on_off },
                  function(err,rem){
                     if(err)
                        console.log("error while removing song from playlist");
                     console.log("playlist shared toggle");
                  });
            };
            q12();
            res.send(''); 
         }
         else{
            //console.log(on_off);
            res.send('');
         }
      }
      if(req.query.flag == "rename"){
         var old_playlist = req.query.playlist_name;
         var new_playlist = req.query.value;
         console.log('renaming playlist-----. ',old_playlist,new_playlist);
         playlist.update({"name":old_playlist,"user_name":req.user.username}, 
            {"name":new_playlist},function(err,write){
            if(err)
               console.log('updated');
            else{
               console.log(' updated playlist '+old_playlist+' '+new_playlist);
               res.status(200).send('Done');
            }
         });
      }
      if(req.query.flag == "delete"){
         var del_playlist = req.query.name;
         playlist.remove({name:del_playlist,user_name:req.user.username},function(err,result){
            if(err)
               console.log("error in deleting playlist");
            console.log("playlist deleted succesfully ",del_playlist);
            res.status(200).send('Done');
         });
      }
   }
   else{
      if(req.query.flag=='songs'){
         var q31 = function(fn){
            playlist.find({shared:true,"name":req.query.name}).exec(function(err,plist){
               if(err)
                  console.log('Error occured',err);
               return fn && fn(null,plist);
            });
         };
         q31(function(err,play){
            if(err)
               console.log(err);
            songs.find({
               '_id': { $in: play[0].song_id}
            }, function(err, docs){
               res.send(docs);
            });
         });
      }
      else{
         res.send('0');
      }
   }
});

router.post('/',function(req,res,next){
   //console.log("dsdfsdfdsfd",req.body);
   //console.log("dsdfsdfdsfd  ",req.body["song[]"][0]);
   if(req.user){
      if(req.body.flag=='insert'){
         //console.log(req.body["song[]"]);
         //console.log(req.body.pname);
         var p_name = req.body.pname;
         //console.log("------"+p_name);
         var s_arr = req.body["song[]"];
         if( typeof s_arr === 'string' ) {
            s_arr = [ s_arr ];
         }
         //console.log("*****"+name);
         //db.students.update(
         //{ name: "joe" },
         //{ $push: { scores: { $each: [ 90, 92, 85 ] } } }
         //)
         var q1 = function(variable) {
            var ct = variable;
            playlist.update(
               {"name":ct,"user_name":req.user.username},
               { $addToSet: {"song_id": { $each: s_arr } } } ,
               function(err, ip1) {
                  if (err) console.log(err);
                  console.log("Updated");
               });
         };
         q1(p_name);
         res.send('');
      }
   }
   else{
      res.send('0');
   }
});

module.exports = router;

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
   //console.log('rate playlist');
   //res.status(200).send('');
   if(req.user){
      var playlist_id = req.query.pid;
      var old_rat;
      if(req.query.flag=="rate"){
         var rating = req.query.rating;
         playlist.find({"_id":playlist_id,"users.user_name":req.user.username},{users:1}).exec(function(err,rat){
            if(rat.length == 0 )
               old_rat=0;
            else{
               for(var i=0;i<rat[0].users.length;i++){
                  //console.log("there there ",result[0].users[i].user_name);
                  if(rat[0].users[i].user_name == req.user.username ){
                     old_rat=rat[0].users[i].rating;
                     break;
                  }
               }
            }
            console.log('ha ha ',old_rat);
            playlist.update({ "_id":playlist_id  },
               {$pull:{users:{user_name: req.user.username}}},
               {multi:true}).exec(function(err,result1){
                  if(err)
                     console.log(err);
                  playlist.update({_id:playlist_id},
                     { $addToSet:{users:{user_name:req.user.username,rating:rating}}},function(err,result){
                        if(err)
                           console.log(err);
                        if(result1.nModified==1){
                           rating=rating-old_rat;
                           playlist.update({_id:playlist_id},
                              {$inc:{rating:rating}},function(err,fresult){
                                 console.log("rating succesfully updated");
                                 res.status(200).send('');
                              });
                        }
                        else{
                           playlist.update({_id:playlist_id},
                              {$inc:{rating_count:1,rating:rating}},function(err,fresult){
                                 console.log("rating succesfully updated");
                                 res.status(200).send('');
                              });
                        }
                     });
               });
         });
      }
      else if(req.query.flag == "get"){
         playlist.find({ "_id":playlist_id , "users.user_name":req.user.username },{users:1}).exec(function(err,result){
            if(err)
               console.log(err);
            var mresult=[];
            if(result.length == 0 )
               mresult.push({flag:false});
            else{
               mresult.push({flag:true});
               for(var i=0;i<result[0].users.length;i++){
                  //console.log("there there ",result[0].users[i].user_name);
                  if(result[0].users[i].user_name == req.user.username ){
                     mresult.push({rating:result[0].users[i].rating});
                     break;
                  }
               }
            }
            //console.log("here --->>> ",mresult);
            res.send(mresult);
         });
      }
      else if(req.query.flag == "get_tot"){
         playlist.find({ "_id":playlist_id },{ rating:1 , rating_count:1}).exec(function(err,result){
            if(err)
               console.log(err);
            res.send(result);
         });
      }
   }
});
module.exports = router;

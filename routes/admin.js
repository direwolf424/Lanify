var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var mongoose = require('mongoose');
var mm = require('musicmetadata');
var multer = require('multer');
var db_user= require('../model/user').user;
var db_song = require('../model/songs').Song;
//var upload = multer({ dest: '/myfile/dc/lanify/upload/added'});
mongoose.createConnection('mongodb://localhost/music');

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, '/myfile/dc/lanify/upload/added');
   },
   filename: function (req, file, cb) {
      cb(null, file.originalname );
   }
});
var upload = multer({storage:storage});
var upload_cnt;
function split_Artist(str){
   str1 = str.split(/[&,]+/);
   return str1;
}
function calculate_length(time){
   var time1 = parseInt(time);
   var min = time1/60;
   var sec=time%60;
   if(isNaN(sec)){
      sec='00';
   }
   else
      sec=Math.floor(sec);
   if(isNaN(min)){
      min='00';
   }
   else
      min=Math.floor(min);
   min = min.toString();
   sec = sec.toString();
   if(min.length == 1)
      min='0'+min;
   if(sec.length == 1)
      sec='0'+sec;
   time = min +":"+sec;
   return time;
}
function write_song(title,album,artist,year,language,file,callback){
   var tmp_path = 'upload/added/'+file.originalname;
   var title=title;
   title=title.trim();
   var album = album;
   album=album.trim();
   var artist = artist;
   var year = year;
   var arr_artist = split_Artist(artist);
   var lang = language;
   var time='';
   //console.log(title);
   //console.log(album);
   //console.log(artist);
   //console.log(year);
   //console.log(language);
   //console.log(file);
   db_song.update({"title":title},
      {
         $set: {
            title:title,
            album:album,
            artist:arr_artist,
            genre:'',
            //path:target_path,
            path:tmp_path,
            album_art_small:'/cover/FRONT_COVER.jpg',
            album_art:'/image/image.jpg',
            rating:0,
            views:0,
            likes:0,
            dislikes:0,
            release_date:year,
            length:time,
            language:lang
         },
         $currentDate: {
            lastModified: true,
         }
      },
   { upsert:true }).exec(function(err,write){
      if(err)
         console.log('error in writing to db',err);
      else{
         console.log(' written ',title);
         upload_cnt++;
         callback();
      }
   });
}

router.get('/',function(req, res, next) {
   res.render('index');
});
router.get('/upload',function(req, res, next) {
   res.render('upload');
});
router.get('/upload_folder',function(req,res,next){
   res.render('upload_folder');
});
router.post('/upload', upload.single('music'), function (req, res, next) {
   var tmp_path = 'upload/added/'+req.file.originalname;
   var title=req.body.title;
   title=title.trim();
   var album = req.body.album;
   album=album.trim();
   var artist = req.body.artist;
   var year = req.body.year;
   var arr_artist = split_Artist(artist);
   var lang = req.body.language;
   var target_path = 'upload/' + lang + '/' + title+'.mp3';
   //fs.rename(tmp_path, target_path ,function(err)  {
   //if (err) 
   //console.log('error occured in rename file ',err);
   //var metadata = mm.sync(null,fs.createReadStream(target_path),{duration:true});
   //var time=metadata.duration;
   var time='';
   //time = calculate_length(time);
   //var year = metadata.year;
   db_song.update({"title":title},
      {
         $set: {
            title:title,
            album:album,
            artist:arr_artist,
            genre:'',
            //path:target_path,
            path:tmp_path,
            album_art_small:'/cover/FRONT_COVER.jpg',
            album_art:'/image/image.jpg',
            rating:0,
            views:0,
            likes:0,
            dislikes:0,
            release_date:year,
            length:time,
            language:lang
         },
         $currentDate: {
            lastModified: true,
         }
      },
   { upsert:true }).exec(function(err,write){
      if(err)
         console.log('error in writing to db',err);
      else{
         console.log(' written ',title);
         res.status(200).send('successfully uploaded');
      }
   });
      //});
});
router.post('/upload_folder', upload.array('music'), function (req, res, next) {
   //console.log('multi uploading ');
   //console.log(req.files);
   //console.log('multi uploading ');
   //console.log(req.body);
   var title,album,artist,year,language,file;
   upload_cnt=0;
   for(var i=0;i<req.files.length;i++){
      //console.log(req.files[i].originalname);
      //console.log(req.body.title[i]);
      title=req.body.title[i];
      album=req.body.album[i];
      artist=req.body.artist[i];
      year=req.body.year[i];
      language=req.body.language[i];
      file=req.files[i];
      write_song(title,album,artist,year,language,file,function(){
         console.log('--->',upload_cnt);
         console.log('--->',req.files.length);
         if(upload_cnt==req.files.length)
            res.status(200).send('successfully uploaded');

      });
   }
});

router.get('/rename',function(req,res,next){
   if(req.query.flag == "album"){
      var old_album = req.query.album_name;
      var new_album = req.query.value;
      db_song.update({"album":old_album},
         {
            $set: {
               album:new_album,
            },
            $currentDate: {
               lastModified: true,
            }
         },
      { upsert:true,
         multi:true }).exec(function(err,write){
            if(err)
               console.log('updated');
            else{
               console.log(' updated album '+old_album+' '+new_album);
            }
         });
         res.status(200).send('Done');
   }
   else if(req.query.flag == "artist"){
      var old_artist = req.query.artist_name;
      var new_artist = split_Artist(req.query.value);
      db_song.update({"artist":old_artist},
         {
            $set: {
               artist:new_artist,
            },
            $currentDate: {
               lastModified: true,
            }
         },
      {multi:true }).exec(function(err,write){
         if(err)
            console.log('updated');
         else{
            console.log(' updated artist '+old_artist+' '+new_artist);
         }
      });
         res.status(200).send('Done');
   }
   else
      res.send('cant rename');
});

module.exports = router;

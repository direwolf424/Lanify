var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db = require('../model/songs').Song;
var db_ip = require('../model/ip_table').Ip;
mongoose.createConnection('mongodb://localhost/music');
   var path,album,artist,songs;



router.get('/',function(req,res,next){

   var x =decodeURIComponent(req.originalUrl);
   //    console.log(x);
   x= x.substr(8, x.length-8);
   console.log(x);

   var finishRequest = function(result) {
      res.send(result);
   };

   var q1 = function(fn) {
      db.update({"title":x},{$inc:{views:1}}, function(err, songs) {
         if (err) throw err;
         console.log("Updated ---->",req.ip+" ",req.user.username);
         return fn && fn(null,"Updated");
      });
   };

   var q2 = function(fn) {
      //db_ip.find({"ip":req.ip}).exec( function(err, ip) {
      db_ip.update({"ip":req.ip},{$inc:{clicks:1}},{upsert:true}, function(err, ip) {
         //db_ip.insert({"ip":req.ip}, function(err, ip) {
         if (err) throw err;
         //console.log("ip added to database ---->",ip);
         return fn && fn(null,"Updated");
         });
      };

      var q3 = function(fn) {
         //db_ip.find({"ip":req.ip}).exec( function(err, ip) {
         db_ip.update({"ip":req.ip},{$addToSet:{songs:x},$currentDate: {lastModified:true }}, function(err, ip1) {
            //db_ip.insert({"ip":req.ip}, function(err, ip) {
            if (err) throw err;
            //console.log("ip added to database ---->",ip);
            return fn && fn(null,"added");
            });
         };
         q1(function (err, result) {
            if (err)
               throw err;
            q2(function(err,result1){
               if(err)
                  throw err;
               //finishRequest(result);
               q3(function(err,result2){
                  if(err)
                     throw err;
                  finishRequest(result);
               });
            });
         });
         });

         module.exports = router;

var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db_request= require('../model/request').request;
mongoose.createConnection('mongodb://localhost/music');
var path,album,artist,songs;

router.post('/',function(req,res,next){
   //console.log('request ansdk --------------------------');
   //console.log(req.body);
   //console.log(req.body.username);
   var name = req.body.username;
   var songname = req.body.songname;
   var bugs = req.body.bugs;
   var features = req.body.features;
   db_request.update({"ip_addr":req.ip},{"name":name,
                     "ip_addr":req.ip,
                     $addToSet:{"bugs":bugs,
                        "features":features,
                        "song":songname
                     }},
                     {upsert:true}, function(err, ip) {
                        //db_ip.insert({"ip":req.ip}, function(err, ip) {
                        if (err) throw err;
                        //console.log("query added ---->",ip);
                     });
});

module.exports = router;

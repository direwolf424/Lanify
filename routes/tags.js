/**
 * Created by Saurabh on 22-Feb-16.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db = require('./db').Song;
var db_tag = require('./db').tags;
mongoose.createConnection('mongodb://localhost/music');
var path,album,artist,songs;

router.get('/',function(req,res,next){

    var x =decodeURIComponent(req.originalUrl);
    var id = x.substr(6,24)
    var tag = req.query['tag'];
    var finishRequest = function(result) {
        res.send(result);
    };

    var q1 = function(fn) {
        for(var i=0;i<tag.length;i++)
        {
            var ct = tag[i];
            console.log("----"+ct);
            db.update({"_id":id},{$addToSet:{tags:tag[i]}}, function(err, ip1) {
                if (err) throw err;
                console.log("Tags Added");
            });

            db.find({"_id":id},function(err,result){
               if(err) throw err;
                console.log(ct);
                db_tag.update({"name":ct},{$addToSet:{songs:result}},
                    {upsert:true}, function(err, ip1) {
                    if (err) throw err;
                    console.log("Updated");
                });
            });
        }
    };

     q1(function (err, result) {
     if (err)
     throw err;
     finishRequest(result);
     });

});

module.exports = router;

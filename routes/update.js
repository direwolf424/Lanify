/**
 * Created by Saurabh on 16-Feb-16.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db = require('./db').Song;
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
            console.log("Updated");
            return fn && fn(null,"Updated");
        });
    };


    q1(function (err, result) {
        if (err)
            throw err;
        finishRequest(result);
    });
});

module.exports = router;
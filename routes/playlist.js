var Playlist = require('../model/playlist').Playlist;
var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var playlist = require('../model/playlist').Playlist;
mongoose.createConnection('mongodb://localhost/music');
var path,album,artist,songs;

router.get('/',function(req,res,next){

    var x =decodeURIComponent(req.originalUrl);
    console.log(x);
    var name = req.query['name'];
    console.log("------"+name);
    var name = req.query['song'];
    console.log("*****"+name);
    var q2 = function(variable) {
        var ct = variable;
        playlist.update({"name":ct,"song": id}, {$inc:{"count":1}}, {upsert:true,new:true}, function(err, ip1) {
            if (err) console.log(err);
            console.log("Updated");
        });
    };

});

module.exports = router;

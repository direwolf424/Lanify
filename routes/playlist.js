var Playlist = require('../model/playlist').Playlist;
var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db = require('../model/songs').Song;
mongoose.createConnection('mongodb://localhost/music');
var path,album,artist,songs;

router.get('/',function(req,res,next){

    var x =decodeURIComponent(req.originalUrl);
    console.log(x);
    
});

module.exports = router;

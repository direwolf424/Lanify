var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var fs = require('fs');
var db = require('../model/songs').Song;

mongoose.createConnection('mongodb://localhost/music');


router.get('/', function(req, res, next) {

//    alert("Getting alert");
    var x =decodeURIComponent(req.originalUrl);
    x= x.substr(8, x.length-8);
    var result = [];
//    console.log(x);
    var finishRequest = function(result) {
//        res.render('album', {artist:x,title:"Title", songs: songs_all });
        res.send(result,{ 'Content-Type' : 'application/json' } ,200);
//        res.json(songs_all);
    };

    // first query
    var q1 = function(fn) {
        db.find({"artist":{'$regex':x}}, function(err, songs) {
            if (err) throw err;
            return fn && fn(null,songs);
        });
    };

    var q2 = function(fn) {
        db.collection.distinct("album", {"artist":{'$regex':x}}, function(err, album) {
            if (err) throw err;
            return fn && fn(null,album);
        });
    };

    var q3 = function(fn) {
        db.collection.distinct("album_art", {"artist":{'$regex':x}}, function(err, album_art) {
            if (err) throw err;
            return fn && fn(null,album_art);
        });
    };
    //Standard nested callbacks
    q1(function (err, songs) {
        result.push(x);
        if (err)
            throw err;
        result.push(songs);
        q2(function(err,albums){
            if(err)
                throw err;
            result.push(albums);
            q3(function(err,album_art){
                if(err)
                    throw err;
                result.push(album_art);
                finishRequest(result);
            });
        });
    });

/*
    var x =decodeURIComponent(req.originalUrl);
//    console.log(x);
    x= x.substr(8, x.length-8);
//    console.log(x);
    db.find({"artist":{'$regex':x}}, function(err, songs) {
        if (err) throw err;
        songs_all = songs;
//        console.log(songs);
    });
    db.collection.distinct("album", {"artist":{'$regex':x}}, function(err, album) {
        if (err) throw err;
        albums = album;
//        console.log(albums);
    });

    res.render('artist', {artist:x, title:"Title", songs: songs_all,albums:albums });
*/
});

module.exports = router;

// the schema is useless so far
// we need to create a model using it

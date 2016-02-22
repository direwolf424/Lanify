var mongoose = require('mongoose');
var fs = require('fs');
var pa = require('path');
var id3 = require('id3js');
var Sync = require('sync');
mongoose.connect('mongodb://localhost/music');
var Schema = mongoose.Schema;

var songScheme = new Schema({
    title:String,
    path:String,
    artist:Array,
    album:String,
    length:String,
    release_date: Date,
    album_art:String,
    album_art_small:String,
    rating:Number,
    views:Number,
    genre:String,
    tags:Array
},{ collection: 'new' });

// the schema is useless so far
// we need to create a model using it

var Song = mongoose.model('Song',songScheme);

var ip_table = new Schema({
   ip:String,
   clicks:Number,
   songs:Array
},{ collection: 'ip_info' });

var tag_scheme = new Schema({
    name: String,
    songs: Array
},{collection:'tags'});
// the schema is useless so far
// we need to create a model using it

var Ip = mongoose.model('Ip',ip_table);
var tags = mongoose.model('tags',tag_scheme);
var name;

var path,songs_all,albums,album_arts;
Song.find({}).sort({views: -1}).limit(16).exec(function(err, songs) {
    if (err) throw err;
    songs_all = songs;
});


Song.collection.distinct("album_art", function(err, results){
    if (err) throw err;
    album_arts = results;
});

Song.collection.distinct("album", function(err, results){
    if (err) throw err;
//    console.log(results);
    albums = results;
});

Song.collection.distinct("artist", function(err, results){
    if (err) throw err;
   //console.log(results);
    artist = results;
});
var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('------------------------------------------>>>>>>>>',req.ip);
    //console.log('------------------------',req.username);
    res.render('db', {songs:songs_all, artists:artist ,dirname:__dirname,albums:albums,album_arts:album_arts });
});

module.exports.Route = router;
module.exports.Song = Song;
module.exports.Ip = Ip;
module.exports.tags = tags;

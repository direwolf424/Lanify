var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var playlist_scheme = new Schema({
   name: String,
   song_id:Array,
   date_created:Date,
   shared:Number,
   likes:Number,
   dislikes:Number,
   user_name:String
},{collections:'playlist'});

var Playlist = mongoose.model('playlist',playlist_scheme);

module.exports.Playlist = Playlist;

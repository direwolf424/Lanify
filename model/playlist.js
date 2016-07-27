var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var playlist_scheme = new Schema({
   name: String,
   song_id:Array,
   date_created:Date,
   shared:Boolean,
   likes:Number,
   dislikes:Number,
   user_name:String,
   rating:Number,
   rating_count:Number,
   hits:Number,
   users:Array
},{collections:'playlist'});

playlist_scheme.index({ name: 1, user_name: 1}, { unique: true });
var Playlist = mongoose.model('playlist',playlist_scheme);

module.exports.Playlist = Playlist;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var default_playlist_scheme = new Schema({
   name: String,
   song:Array,
   date_created:Date,
   user_name:String
},{collections:'default_playlist'});

var Playlist_default = mongoose.model('default_playlist',default_playlist_scheme);

module.exports.Playlist_default = Playlist_default;

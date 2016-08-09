var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songScheme = new Schema({
   title:{
      type:String,
      required:true
   },
   language:String,
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
   tags:Array,
   likes:Number,
   dislikes:Number,
   lastModified: { type: Date, default: Date.now }
//},{ collection: 'songs' });
},{ collection: 'new' });


songScheme.index({ title: 1, album: 1}, { unique: true });
var Song = mongoose.model('Song',songScheme);

module.exports.Song = Song;


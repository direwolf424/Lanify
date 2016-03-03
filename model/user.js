var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user_scheme = new Schema({
   username:String,
   password:String,
   roll_no:String,
   playlist:Array,
   liked_songs:Array,
   disliked_songs:Array,
},{collections:'user'});

var user = mongoose.model('user',user_scheme,'user');

module.exports.user = user;

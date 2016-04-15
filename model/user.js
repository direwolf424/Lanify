var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var user_scheme = new Schema({
   username:String,
   password:String,
   roll_no:String,
   playlist:Array,
   liked_songs:Array,
   disliked_songs:Array,
   mobile_no:String
},{collections:'user'});

// methods ======================
// generating a hash
user_scheme.methods.generateHash = function(password) {
       return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
user_scheme.methods.validPassword = function(password) {
       return bcrypt.compareSync(password, this.password);
};

var user = mongoose.model('user',user_scheme,'user');

module.exports.user = user;

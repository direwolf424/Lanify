var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var cookie_scheme = new Schema({
   token: Array
},{collections:'cookies'});

var Cookies = mongoose.model('cookies',cookie_scheme);

module.exports.Cookies = Cookies;


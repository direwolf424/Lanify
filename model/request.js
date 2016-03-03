var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var request_scheme = new Schema({
   name: String,
   ip_addr:String,
   song:Array,
   bugs:Array,
   features:Array
},{collections:'request'});


var request = mongoose.model('request',request_scheme);

module.exports.request = request;

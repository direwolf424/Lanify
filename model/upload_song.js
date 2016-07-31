var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var upload_scheme = new Schema({
   user_name: String,
   song:Array
},{collections:'upload'});


var upload = mongoose.model('upload',upload_scheme);

module.exports.upload = upload;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ip_table = new Schema({
   ip:String,
   clicks:Number,
   songs:Array,
   lastModified: { type: Date, default: Date.now }
},{ collection: 'ip_info' });


var Ip = mongoose.model('Ip',ip_table);

module.exports.Ip = Ip;

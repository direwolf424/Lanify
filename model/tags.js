var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tag_scheme = new Schema({
    name: String,
    song: String,
    count: Number
},{collection:'tags'});



var tags = mongoose.model('tags',tag_scheme);

module.exports.tags = tags;

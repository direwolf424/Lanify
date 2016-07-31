/**
 * Created by Saurabh on 28-Jul-16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var default_exit_date = '01/01/2000';

var analytics_session_table = new Schema({
    username:String,
    visit_time:{type:Date, default:Date.now()},
    exit_time:{type:Date, default:default_exit_date},
    logged_in:{type:Boolean, default:false},
    ip_address:String,
    browser:String,
    operating_system:String,
    platform:String,
    socket_id:String,
    active:{type:Boolean,default:true}
},{ collection: 'analytics_session' });

var analytics_actions_table = new Schema({
    name:String,
    reference:String,
    socket_id:String,
    count:{type:Number,default:0}
},{ collection: 'analytics_actions' });

var analytics_actions = mongoose.model('analytics_actions',analytics_actions_table);
var analytics_session = mongoose.model('analytics_session',analytics_session_table);

module.exports.analytics_session = analytics_session;
module.exports.analytics_actions = analytics_actions;

/*
page- home, album ,artist, songs, genre, playlist, now_playing, request, info
actions- add_to_playlist, play_song, play_all, add_to_queue, clear_queue, single_album_click, single_artist_click, add_tags,
         remove_from_queue, rename_playlist, share_playlist, delete_playlist
search- song_found, album_found, artist_found, not_found
visit time
refresh/close time
time_spent
logged_in
not_logged_in
logout
ip_address- h1, h2, ... , h13
user_name
session
user
platform-desktop, mobile
browser
os

users-
visit time
exit time
logged_in
ip_add
user_name
platform
browser
os

search-
users_id
query
song_found
album_found
artist_found
not_found

action-
action_name- add_to_playlist, play_song, play_all, add_to_queue, clear_queue, single_album_click, single_artist_click, add_tags,
             remove_from_queue, rename_playlist, share_playlist, delete_playlist
ref- home, album ,artist, songs, genre, playlist, now_playing, request, info
action_user- user_id
count


queries-
active users-logged in/not logged in
daily
hostel wise
*/

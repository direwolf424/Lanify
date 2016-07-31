/**
 * Created by Saurabh on 29-Jul-16.
 */
var Playlist = require('../model/playlist').Playlist;
var express = require('express');
var router = express.Router();
var url = require('url');
var parser = require('ua-parser-js');
var mongoose = require('mongoose');
var analytics_session = require('../model/analytics').analytics_session;
var analytics_actions = require('../model/analytics').analytics_actions;
mongoose.createConnection('mongodb://localhost/music');

var session_connect = function(socket_id,ip,req,user,fn){
    var ua = parser(req.headers['user-agent']);
    ip = ip.substr(7);
    console.log(ip);
    var platform = ua.device.type;
    var username = user.userName;
    var logged_in = user.loggedin;
    var visit_time = user.time;
    if(platform==undefined)
        platform='desktop';
    var session_json = analytics_session({
        "username":username,
        "logged_in":logged_in,
        "ip_address":ip,
        "browser":ua.browser.name,
        "operating_system":ua.os.name+" "+ua.os.version,
        "platform":platform,
        "socket_id":socket_id,
        "visit_time":Date.now()
    });
    session_json.save(function(err) {
        if (err){
            console.log("Error in saving session"+err);
            return fn && fn(err);
        }
        console.log("Session saved");
        return fn && fn(null);
        }
    );
};

var session_disconnect = function(socket_id,fn){
    analytics_session.update({"socket_id":socket_id},{"exit_time":Date.now(),"active":false},function(err){
        if(err)
        {
            console.log("Error in user disconnect"+err);
            return fn && fn(err);
        }
        console.log("User disconnected");
        return fn && fn(null);
    });
};

var session_disconnect_all = function(fn){
    analytics_session.update({},{$set:{"exit_time":Date.now(),"active":false}},{multi:true},function(err){
        if(err)
        {
            console.log("Error in user disconnect"+err);
            return fn && fn(err);
        }
        console.log("All users disconnected");
        return fn && fn(null);
    });
};

var get_active_sessions = function(fn){
    analytics_session.find({"active":true}).exec(function(err,data){
        if(err)
            return fn && fn(err,null);
        return fn && fn(null,data);
    });
};

var get_all_sessions = function(start_date,end_date,fn){
    analytics_session.find({"visit_time":{"$gt":start_date,"$lt":end_date},"exit_time":{"$gt":start_date,"$lt":end_date}}).exec(function(err,data){
        if(err)
            return fn && fn(err,null);
        return fn && fn(null,data);
    });
};

var action_log = function(action_name, reference, socket_id, fn) {
    analytics_actions.update({"name":action_name,"ref":reference,"socket_id":socket_id},{$inc:{count:1}},{upsert:true},function(err){
        if(err)
            return fn && fn(err);
        console.log("Action logged "+action_name+" "+reference+" "+socket_id);
        return fn && fn(null);
    });
};

router.get('/',function(req,res){
    if(req.query.flag=='get_active_sessions'){
        get_active_sessions(function(err,data){
            if(err){
                console.log("Error in getting session data"+err);
                res.status(404).send("Error in getting session data");
            }
            if(data)
            {
                console.log("Success in getting session data");
                res.status(200).send(data);
            }
        });
    }
    else if(req.query.flag=='get_all_sessions'){
        var start_date = req.query.start_date;
        var end_date = req.query.end_date;
        get_all_sessions(start_date,end_date,function(err,data){
            if(err)
            {
                console.log("Error in getting session data"+err);
                res.status(404).send("Error in getting session data");
            }
            if(data)
            {
                console.log("Success in getting session data");
                res.header("Cache-Control", "no-cache, no-store, must-revalidate");
                res.header("Pragma", "no-cache");
                res.header("Expires", 0);
                res.status(200).send(data);
            }
        });
    }
    else if(req.query.flag=='action'){
        action_log(req.query.name,req.query.reference,req.query.socket_id,function(err){
            if(err)
            {
                console.log("Error in action log "+err);
                res.send("Error in updating action");
            }
            res.send("Successfully updated action");
        });
    }
});

module.exports.router = router;
module.exports.session_connect = session_connect;
module.exports.session_disconnect = session_disconnect;
module.exports.session_disconnect_all = session_disconnect_all;
/**
 * Created by Saurabh on 22-Feb-16.
 */
var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db = require('./db').Song;
var db_tag = require('./db').tags;
mongoose.createConnection('mongodb://localhost/music');
var path,album,artist,songs;

router.get('/',function(req,res,next){

    var x =decodeURIComponent(req.originalUrl);
    var option = x.substr(6,6);
    var opt = x.substr(6,3);
    var op = x.substr(6,4);
    var id,tag,songs_arr=[];
    var finishRequest = function(result) {
        console.log('------------------------------->>calling',x);
        res.send(result);
    };


    var q1 = function(fn) {
        for(var i=0;i<tag.length;i++)
        {
            var ct = tag[i];
            console.log("----"+ct);
            db.update({"_id":id},{$addToSet:{tags:tag[i]}}, function(err, ip1) {
                if (err) console.log(err);
                console.log("Tags Added"+id);
            });

            q2(ct);
        }
    };

    var q2 = function(variable) {
        var ct = variable;
        db_tag.update({"name":ct,"song": id}, {$inc:{"count":1}}, {upsert:true,new:true}, function(err, ip1) {
            if (err) console.log(err);
            console.log("Updated");
        });
    };

/*
    var q2 = function(variable) {
        var ct = variable;
        db_tag1.findOne({"name":ct,"songs.id":id}, function(err, res) {
            if (err) console.log(err);
            if(res)
            {
                console.log("Found");
                console.log(res);
            }
            else
            {
                console.log("Not Found");
                var new_data = {
                    name:ct,
                    songs:[
                        {
                            id:id,
                            count:1
                        }
                    ]
                };
                var temp = new db_tag1(new_data);
                temp.save(function(error, data) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log(data);
                    }
                });
            }
        });
*/
/*
        db_tag1.findOneAndUpdate({"name":ct,"songs.id":id},{$addToSet: {"songs": id }, $inc:{"songs.count":1}}, {upsert:true,new:true}, function(err, ip1) {
            if (err) console.log(err);
            console.log("Updated");
            console.log(ip1);
        });
    };
 */

    var q3 = function(fn) {
        db_tag.collection.distinct("name", function(err, results){
            if (err) throw err;
//            console.log("Res"+results);
            return fn && fn(null,results);
        });
    };
/*

    var q3 = function(fn) {
        db_tag.collection.group(group.key,group.cond,group.initial,group.reduce,group.finalise,true,function(err,results) {
            if (err) console.log(err);
            console.log("Result "+results);
            for(var i=0;i<results.length;i++)
            {
                var a = results[i];
                var tag = a.name;
                var song_array = a.songs;
                console.log("Tag "+tag);
                for(var j=0;j<song_array.length;j++)
                {
                    var song = song_array[j];
                    console.log("Song "+song);
                    q4(tag,song);
                }
            }
//            return fn && fn(null,results);
        });
    };
 */
    var vari;
    var q5 = function(fn) {
        db.find({"_id":vari},function(err, res) {
            if (err) console.log(err);
            var temp = {};
            temp.name = tag;
            temp.song = res;
//            console.log("RES "+temp);
            return fn && fn(null,temp);
        });
    };

    var cntr=0;
    var q4 = function(fn) {
        db_tag.find({"name":tag}).sort({count: -1}).exec(function(err, result) {
            if (err) console.log(err);
            songs_arr = [];
            var t = result;
            for(var i=0;i<t.length;i++)
            {
                vari = t[i].song;
                q5(function (err, r) {
                    if (err)
                        throw err;
                    songs_arr.push(r);/*
                    console.log("Array -->",songs_arr);
                    console.log("Song -->"+ r.song);
                    console.log('i -->',i+' '+cntr);*/
                    cntr++;
                    if (cntr>=t.length) {
//                        console.log("Array--------- ",i);
                        return fn && fn(null,songs_arr);
                    }
                })

            }
        });
    };

    if(option=="update")
    {
        id = x.substr(13,24)
        tag = req.query['tag'];

        q1(function (err, result) {
            console.log(err);
            finishRequest(result);
        });
    }
    else if(opt=="get")
    {
        q3(function (err, result) {
            if (err)
                throw err;
            finishRequest(result);
        });
    }
    else if(op=="song")
    {
        tag = req.query['tag'];
        q4(function (err, result) {
            if (err)
                throw err;
            finishRequest(result);
        });
    }
});

module.exports = router;

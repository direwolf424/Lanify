var express = require('express');
var router = express.Router();
var url = require('url');
var mongoose = require('mongoose');
var db_user= require('../model/user').user;
mongoose.createConnection('mongodb://localhost/music');
   var path,album,artist,songs;

router.post('/',function(req,res,next){
   var uname = req.body.username;
   var psswd = req.body.password;
   var mobno = req.body.mobileno;
   var rollno = req.body.rollno;
   console.log('----------------------------------------->>',uname,psswd,mobno,rollno);
   db_user.find({"username":uname}).exec(function(err,users){
      if(users.length){
         console.log('User already registred');
         res.send({message:'Sorry,Username already taken'});
      }
      else{
         var new_user1 = new db_user();
         var new_user = new db_user({
            'username':uname,
            'password':new_user1.generateHash(psswd),
            'roll_no' :rollno,
            'mobile_no':mobno
         });
         //console.log(db_user);
         new_user.save(function(err) {
            if (err)
               throw err;
            res.send({message:'Registration Successfull',flag:1});
            console.log('Registration Successfull');
         });
      }
   });
});

module.exports = router;

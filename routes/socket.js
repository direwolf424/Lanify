/**
 * Created by Saurabh on 29-Jul-16.
 */
var socket = require('socket.io');
var session_connect = require('./analytics').session_connect;
var session_disconnect = require('./analytics').session_disconnect;

function remove_user(user_array,socket_id,callback){
   for(var i=0;i<user_array.length;i++){
      console.log(user_array[i].socket_id+'  ',socket_id);
      if(user_array[i].socket_id==socket_id)
         return callback(null,i);
   }
}
function unique_user(user_array,username,callback){
   if(username=='Lanify_Default')
      callback(null,true);
   for(var i= 0;i<user_array.length;i++){
      if(user_array[i].nick==username)
         return callback(null,false);
   }
   return callback(null,true);
}
var connect_function = function(server) {

   var listener  = socket.listen(server);
   var online_user=[];

   listener.sockets.on('connection', function (socket) {
      console.log(listener.engine.clientsCount+' users connected');
      socket.on('user', function (user) {
         session_connect(socket.id,socket.handshake.address,socket.request,user,function(err){
            if(err)
               console.log("Error in connecting user"+err);
            console.log("Socket connected"+socket.id);
         });
         socket.emit('session_info', {'socket_id': socket.id});
         default_txt={'nick':user.userName,'msg':'new user connected to Lanify'};
         listener.sockets.emit('chat message',default_txt);
         unique_user(online_user,user.userName,function(err,value){
            if(value){
               online_user.push({'nick':user.userName,'socket_id':socket.id});
               listener.sockets.emit('online user',online_user);
            }
         });
      });

      socket.on('disconnect', function () {
         var tmp_id=socket.id;
         session_disconnect(socket.id,function(err){
            if(err)
               console.log("Error in disconnecting user"+err);
            else {
               remove_user(online_user,tmp_id,function(err,index){
                  online_user.splice(index,1);
                  listener.sockets.emit('online user',online_user);
               });
               console.log("Socket disconnected");
            }
         });
      });
      socket.on('chat message',function(msg){
         console.log(msg);
         listener.sockets.emit('chat message',msg);
      });
   });
};

module.exports.socket = connect_function;

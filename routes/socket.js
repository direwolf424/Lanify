/**
 * Created by Saurabh on 29-Jul-16.
 */
var socket = require('socket.io');
var session_connect = require('./analytics').session_connect;
var session_disconnect = require('./analytics').session_disconnect;

var connect_function = function(server) {

    var listener  = socket.listen(server);

    listener.sockets.on('connection', function (socket) {
        console.log(listener.engine.clientsCount+' users connected');
        socket.on('user', function (user) {
            session_connect(socket.id,socket.handshake.address,socket.request,user,function(err){
                if(err)
                    console.log("Error in connecting user"+err);
                console.log("Socket connected"+socket.id);
            });
            socket.emit('session_info', {'socket_id': socket.id});
        });

        socket.on('disconnect', function () {
            session_disconnect(socket.id,function(err){
                if(err)
                    console.log("Error in disconnecting user"+err)
                else {
                    console.log("Socket disconnected");
                }
            });
        });
    });
};

module.exports.socket = connect_function;
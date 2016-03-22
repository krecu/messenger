var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('../config');

io.on('connection', function(socket){
    console.log('WebSocket new user connected');
});

http.listen(config.webSocket.port, function(){
    console.log('Socket listen on port *:3000');
});

module.exports = io;
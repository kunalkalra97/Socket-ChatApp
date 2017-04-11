var express = require('express');
var app = express();
var http = require('http').Server(app).listen(9000);
var io = require('socket.io')(http);

app.use(express.static('public'));

http.listen(9000, function(){
  console.log('listening on port:9000');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on("connection",function (socket) { 

	socket.on('username',function(username){
		
		console.log(username,"is connected");
		io.emit('username',username);
	});

	socket.on('message',function(message) {
		console.log("Message is",message);
		io.emit('message',message);
	});

	socket.on('disconnect',function() {
		console.log('a user disconnected');
		io.emit('disconnect');
	});
	
});





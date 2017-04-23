var express = require('express');
var app = express();
var http = require('http').Server(app).listen(9000);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var connectedUsers = [];
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var db = require('./con_db.js');

function compareArrays(array1, array2, call) {
	array1.forEach(function(element) {
		if (array2.indexOf(element) < 0) {
			call(element);
		}
	});
}


app.use(express.static('public'));

http.listen(9000, function(){
  console.log('listening on port:9000');
});

app.get('/', function(req, res, next){
	res.sendFile(__dirname + '/splash.html');
});

 app.get('/chatBox', function(req, res, next){
   res.sendFile(__dirname + '/index.html');
 });

app.post('/signup',urlencodedParser, function(req, res, next) {

	var email = req.body.email;
	var password = req.body.password;
	
	var user = new db.userTable();
	user.email = email;
	user.password = password;

	db.userTable.find({email:email}, function(err, foundData){
		
		if(foundData.length > 0) {
			res.end('User is already registered');
		}

		else {
			user.save(function(err) {
				if(!err) {
					res.sendFile(__dirname + '/index.html');
				}

				else {
					res.end("Something went wrong, please try again");
				}
			});
		}
	});

});

app.post('/login',urlencodedParser,function(req, res, next){
	var email = req.body.email;
	var password = req.body.password;

	db.userTable.find({email:email, password:password}, function(err,foundData){
		if(!err & foundData.length > 0) {
			res.sendfile(__dirname + '/index.html');
			
		}
		else {
			res.end("Invalid Credentials");
		}
	});
});

io.on("connection",function (socket) { 

	socket.on('username',function(username){
		console.log(username,"is connected");
		io.emit('username',username);
		connectedUsers.push(username);
		console.log(connectedUsers);
	});

	socket.on('message',function(message) {
		console.log("Message is",message);
		io.emit('message',message);
	});

	socket.on('disconnect',function(data) {
		console.log('a user disconnected');
		console.log(data);
		io.emit('disconnect');
		currentConnectedUsers = [];
	});

	socket.on('myname', function(myname) {
		console.log(myname);
		currentConnectedUsers.push(myname);
		console.log(currentConnectedUsers);

		if(connectedUsers.length - currentConnectedUsers.length == 1) {

			compareArrays(connectedUsers,currentConnectedUsers,function(disconnectedName){
				console.log(disconnectedName,"is disconnected");
				io.emit('disconnectedName',disconnectedName);
				connectedUsers = currentConnectedUsers;
			});
		}
	});
	
});





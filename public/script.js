var textarea = $('.message textarea');
var chatBox = $('.chatBox');
var clickButton = $('.sendButton');
var Username;
$(window).load(function(){
    $('.loader').fadeOut("slow");
    $('.loader').css('display', 'none');
});

var socket = io();

$('.userName form').submit(function (e) { 
    e.preventDefault();
    $('#username').attr("disabled",true);
    $('.userName input[type="submit"]').attr("disabled",true);
    $('.chatWrapper').css("display", "block");
    Username = $('#username').val();
    socket.emit('username',Username); 
});

setInterval(function(){
	socket.emit('heartbeat',Username);
},1000);

socket.on('username',function (username) {  

	chatBox.append($('<p id="user">'+username+' is now Connected'+'</p>'));
    
});

socket.on('message',function (message) {

	chatBox.append($('<p class="Message">'+'<b>'+message.Username+'</b><br>'+'<br>'+message.message+'<br>'+new Date()+'</p>'));

});

socket.on('disconnect', function() {
	
	console.log("My name is", Username);
	socket.emit('myname',Username);
});

socket.on("disconnectedName", function(disconnectedName){
	
	chatBox.append($('<p id="user">'+disconnectedName+' disconnected'+'</p>'));
});


textarea.keypress(function(event) {
	
	if (event.which == 13) {

	var message = {Username:Username,message:textarea.val()};

	if(message!="") {

		socket.emit('message',message);
		textarea.val('');

	}
	}
});

clickButton.click(function(event) {

	var message = {Username:Username,message:textarea.val()};

	if(message!="") {

		socket.emit('message',message);
		textarea.val('');

	}		
});

$('.message form').submit(function(e) {

	e.preventDefault();

});




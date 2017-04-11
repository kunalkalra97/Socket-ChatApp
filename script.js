$(window).load(function(){
    $('.loader').fadeOut("slow");
});

$('.userName form').submit(function (e) { 
    e.preventDefault();
    $('#username').attr("disabled",true);
    $('.chatWrapper').css("display", "block");
});

var socket = io();



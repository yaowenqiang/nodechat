//var socket = require('socket.io');
var redis = require('redis');
var redisClient = redis.createClient();
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var messages = [];
var storeMessage = function(name,data){
    //messages.push({name:name,data:data});
    //if(messages.length >9){
        //messages.shift();
    //}
    var message = JSON.stringify({name:name,data:data});
    redisClient.lpush('messages',message,function(err,response){
        redisClient.ltrim('messages',0,10);
    })
};
server.listen(8080);
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
//var io = socket.listen(app);
io.sockets.on('connection',function(client){
    //console.log('client connected...');
    //client.emit('messages',{hello:'world'});
    client.on('join',function(name){
        client.set('nickname',name);
        //messages.forEach(function(message){
            //client.emit('messages',message.name+':'+message.data);
        //});
        redisClient.lrange('messages',0,-1,function(err,messages){
            messages = messages.reverse();
            messages.forEach(function(message){
                message = JSON.parse(message);
                client.emit('messages',message.name+':'+message.data);
            });
        })
    })
    client.on('messages',function(data){
        client.get('nickname',function(err,name){
            storeMessage(name,data);
            client.broadcast.emit('messages',name + ':'+data);
        });
    });
});

//app.listen(8088);

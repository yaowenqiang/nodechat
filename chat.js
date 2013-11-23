//var socket = require('socket.io');
var redis = require('redis');
var redisClient = redis.createClient();
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var messages = [];
var storeMessage = function (name, data) {
    //messages.push({name:name,data:data});
    //if(messages.length >9){
    //messages.shift();
    //}
    var message = JSON.stringify({
        name: name,
        data: data
    });
//    console.log('store messages.');
    redisClient.lpush('messages', message, function (err, response) {
        redisClient.ltrim('messages', 0, 10);
    })
};
server.listen(8080);
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});
//var io = socket.listen(app);
io.sockets.on('connection', function (client) {
//        client.get('nickname', function (err, name) {
//            if(!name){
//                console.log('the user does not oofer a name');
//                client.emit('askname');
//                return;
//            }
//        });
    client.on('join', function (name) {
        client.broadcast.emit('addchatter',name);
        redisClient.smembers('chatters',function(err,names){
            names.forEach(function(name){
                console.log(name);
                client.emit('addchatter',name);
            });
        });
        redisClient.sadd('chatters',name);
        client.set('nickname', name);
        //messages.forEach(function(message){
        //client.emit('messages',message.name+':'+message.data);
        //});
        redisClient.lrange('messages', 0, -1, function (err, messages) {
            messages = messages.reverse();
            messages.forEach(function (message) {
                message = JSON.parse(message);
                client.emit('messages', message.name + ':' + message.data);
            });
        })
    })
    client.on('messages', function (data) {
        client.get('nickname', function (err, name) {
            storeMessage(name, data);
            client.broadcast.emit('messages', name + ':' + data);
        });
    });
    client.on('disconnect',function(name){
        client.get('nickname',function(err,name){
            client.broadcast.emit('removechatter',name);
            redisClient.srem('chatters',name);
        });
    });
});

//app.listen(8088);

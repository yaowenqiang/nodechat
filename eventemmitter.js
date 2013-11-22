var EventEmitter = require('events').EventEmitter;
var logger = new EventEmitter();
logger.on('error',function(message){
    console.log('ERR: ' + message);
});
logger.emmit('error','Splilled Milk');
logger.emmit('error','Eggs Cracked');
//var server = httpd.createserver();
//server.on('request',function(request,response){...});
//server.on('close',function(){...});

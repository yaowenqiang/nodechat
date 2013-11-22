var express = require('express');
var url = require('url');
var app = express();
app.engine('ejs', require('ejs').renderFile);
var request =require('request');
app.get('/randomuser',function(req,response){
    options = {
        protocol:'http:',
        host:'api.randomuser.me/?results=5'
    }
    var requestUrl = url.format(options);
    //console.log(requestUrl);
    request(requestUrl,function(err,res,body){
        var result = JSON.parse(body);
        //console.log(result.results[0].user);
        response.render(__dirname+'/user.ejs',{user:result.results[0].user});
    });
    //}).pipe(response);
});
app.listen(8082);

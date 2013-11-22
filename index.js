var http = require('http');
http.createServer(function(req,res){
    res.writeHead(200,{'Content-type':'text/plain'});
   // res.end('hello world');
   console.log('connected');
}).listen(8080,'127.0.0.1');
console.log('Server routing at http://127.0.0.1:8080');

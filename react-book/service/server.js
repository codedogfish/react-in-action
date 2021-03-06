var fs = require('fs');
var path = require('path')
var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.set('port',(process.env.PORT || 5000))

var allowCrossDomain = function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');

    next();
}

app.use('/',express.static(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(allowCrossDomain);

app.get('/api/comments',function(req,res){
    fs.readFile('comments.json',function(err,data){
        res.setHeader('Cache-Control','no-cache');
        console.log(JSON.parse(data));
        res.json(JSON.parse(data));
    });
});

app.post('/api/comments',function(req,res){
    fs.readFile('comments.json',function(err,data){
        console.log(JSON.parse(data));
        var comments = JSON.parse(data);
        comments.push(req.body);
        fs.writeFile('comments.json',JSON.stringify(comments,null,4),function(err){
            res.setHeader('Cache-Control','no-cache');
            res.json(comments);
        });
    });
});

app.listen(app.get('port'),function(){
    console.log('Server started: http://localhost:'+app.get('port')+'/');
});

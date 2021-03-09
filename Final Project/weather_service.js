const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var htmlspecialchars = require('htmlspecialchars');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static('public'));

//POST to services
app.post('/', jsonParser, function (req, res) {
    const name = req.body.name;
    
    let lines = name + '\n';
    fs.appendFile("messages.txt", lines, function(err) {
        if(err) {
            console.log(err);
            res.send("The message cannot send");
            res.status(400); //failed
        }
        res.send("The message send correctly!");
        res.status(200); //sucessfully
    });
});

app.get('/', function (req, res) {
    // auto "create" the empty file
    // assume that messages.txt exists and has valid content at all times.
    fs.appendFileSync("messages.txt", "");
    res.header("Access-Control-Allow-Origin", "*");
    let data = fs.readFileSync("messages.txt", 'utf8').toString().split('\n');
    data.pop(); //remove empty element
    for(let i = 0; i < data.length; i++){
        data[i] = htmlspecialchars(data[i]);
    }
    //only store 10 histories
    if(data.length > 10){
        fs.readFile("messages.txt", 'utf8', function(err, data){
            let linesExceptFirst = data.split('\n').slice(1).join('\n');
            fs.writeFile("messages.txt", linesExceptFirst, (err) => {
                if(err) {
                    console.log(err);
                    res.status(400); //failed
                }
            });
        });
    }
    // console.log(result);
    res.send(JSON.stringify(data));
});


app.listen(3000);

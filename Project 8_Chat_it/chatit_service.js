const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

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
    const comment = req.body.comment;
    
    let lines = name + ":::"  + comment + '\n';
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
    // //auto "create" the empty file
    // assume that messages.txt exists and has valid content at all times.
    // fs.appendFileSync("messages.txt", "");

    res.header("Access-Control-Allow-Origin", "*");
    let data = fs.readFileSync("messages.txt", 'utf8').split('\n');
    data.pop(); //remove empty element
    //console.log(data);
    let newData = [];
    for(let i = 0; i < data.length; i++){
        newData[i] = data[i].split(":::");
    }
    //console.log(newData.length);

    let result = {};
    
    result["messages"] = [];
    for(let i = 0; i < newData.length; i++){
        let resultData = {};
        resultData["name"] = newData[i][0];
        resultData["comment"] = newData[i][1];
        result["messages"].push(resultData);
    }
    //console.log(result);
    res.send(JSON.stringify(result));
    
});


app.listen(3000);

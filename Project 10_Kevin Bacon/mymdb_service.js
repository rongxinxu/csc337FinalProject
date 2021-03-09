/**
 * Server side code for fetch data (Method: GET)
 * Take firstname, lastname, and mode as a parameter from client
 * connect to database, use SQL query the actors id and movies
 * send the result as a JSON object back to the client side
 */
const express = require("express");
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    let firstname = req.query.firstname;
    let lastname = req.query.lastname;
    let mode = req.query.mode;
    console.log(firstname, lastname, mode);

    let con = mysql.createConnection({
        host: "mysql.allisonobourn.com",
        database: "csc337imdb",
        user: "csc337homer",
        password: "d0ughnut",
        debug: "true"
    });
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        //Find the ID for a given actor's name
        con.query("SELECT DISTINCT id FROM actors " + 
                `WHERE first_name LIKE '${firstname}%' AND last_name = '${lastname}' ` + 
                "ORDER BY film_count DESC, id LIMIT 1", function (err, result, fields) {
            if (err) throw err;
            console.log("Result: " + result[0]);
            if(result.length === 0){
                res.send(JSON.stringify(result));
            }
            else {
            //Find All movie of that actor
                if(mode === "all"){
                    con.query("SELECT m.name, m.year FROM movies m "+
                            "JOIN roles r on r.movie_id = m.id " +
                            "JOIN actors a on a.id = r.actor_id " +
                            `WHERE a.id = ${result[0]["id"]} ORDER BY m.year DESC`, 
                            function (err, result, fields) {
                                if (err) throw err;
                                console.log("Result: " + JSON.stringify(result)); 
                                res.send(JSON.stringify(result));
                            });
                }
                //List of movies with this actor and Kevin Bacon
                if(mode === "KevinBacon") {
                    con.query("SELECT m.name, m.year FROM movies m "+
                            "JOIN roles r on r.movie_id = m.id " +
                            "JOIN actors a on a.id = r.actor_id " +
                            "JOIN roles r2 on r2.movie_id = m.id " +
                            "JOIN actors a2 on a2.id = r2.actor_id " +
                            `WHERE a.id = ${result[0]["id"]} AND a2.first_name = 'Kevin' ` +
                            "AND a2.last_name = 'Bacon' ORDER BY m.year DESC", 
                            function (err, result, fields) {
                                if (err) throw err;
                                console.log("Result: " + JSON.stringify(result)); 
                                res.send(JSON.stringify(result));
                            });
                }
            }
        });
    });
});
app.listen(3000);
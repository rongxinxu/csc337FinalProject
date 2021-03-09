/**
 * University of Arizona
 * CSC337 Homework Assignment 10 Kevin Bacon
 * Author: Vincent Xu
 * NetID: rongxinxu
 * Due Date: 11/18/2018
 * This JavaScript is to search given actors name in the database
 * and return all movies of that actors or 
 * return the movies with Kevin Bacon
 * Two different url represent what output expected (all movie or w/Kevin Bacon)
 * All return data from backend should add insert into a table and display on page
 */
"use strict";
(function () {
    window.onload = function() {
        document.getElementById("all").onclick = findAllMovie;
        document.getElementById("withKevin").onclick = findWithKevin;
    };

    /**
     * url with the mode "all", find all movies of the actors
     * GET data from the service.js
     * Return JSON object with movies names and years
     * call makeTable function to create table for data
     */
    function findAllMovie() {
        let firstName = document.getElementById("firstNameAll").value.toLowerCase();
        let lastName = document.getElementById("lastNameAll").value.toLowerCase();
        clearData();

        let url = `http://localhost:3000?firstname=${firstName}&lastname=${lastName}&mode=all`;
        console.log(url);
        fetch(url)
                .then(checkStatus)
                .then(function(responseText) {
                    //parse it to a JavaScript Object
                    let json = JSON.parse(responseText);
                    console.log(json);
                    //if the actor is not exist
                    if(json.length === 0){
                        document.getElementById("heading").innerHTML = "";
                        document.getElementById("subheading").innerHTML = 
                        `Actor ${firstName} ${lastName} not found.`;
                    }
                    else{
                        document.getElementById("heading").innerHTML = 
                        `Results for ${firstName} ${lastName}`;
                        document.getElementById("subheading").innerHTML = "All Films";
                        makeTable(json);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
    }

    /**
     * url with the mode "KevinBacon", find the actors' movies with Kevin Bacon
     * GET data from the service.js
     * Return JSON object with movies names and years
     * call makeTable function to create table for data
     */
    function findWithKevin() {
        let firstName = document.getElementById("firstNameKB").value.toLowerCase();
        let lastName = document.getElementById("lastNameKB").value.toLowerCase();
        clearData();

        let url = `http://localhost:3000?firstname=${firstName}&lastname=${lastName}` +
                "&mode=KevinBacon";
        console.log(url);
        fetch(url)
                .then(checkStatus)
                .then(function(responseText) {
                    //parse it to a JavaScript Object
                    let json = JSON.parse(responseText);
                    console.log(json);
                    //if the actor is not exist
                    if(json.length === 0){
                        document.getElementById("heading").innerHTML = "";
                        document.getElementById("subheading").innerHTML = 
                        `${firstName} ${lastName} wasn't in any films with Kevin Bacon.`;
                    }
                    else{
                        document.getElementById("heading").innerHTML = 
                        `Results for ${firstName} ${lastName}`;
                        document.getElementById("subheading").innerHTML = 
                        `Films with ${firstName} ${lastName} and Kevin Bacon`;
                        makeTable(json);
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
    }

    /**
     * Create the table for movies and display whole table to the page
     * Each row contain #, movie names, year
     * First row is the heading (must be BOLD)
     * @param {JSON object} json 
     */
    function makeTable(json) {
        //clear the previous data in table
        document.getElementById("dataTable").innerHTML = "";
        let table = document.createElement("table");

        //Headers (#, movie names, year)
        let row = document.createElement("tr");
        let number = document.createElement("th");
        let title = document.createElement("th");
        let year = document.createElement("th");
        number.innerHTML = "#";
        title.innerHTML = "Title";
        year.innerHTML = "Year";
        row.appendChild(number);
        row.appendChild(title);
        row.appendChild(year);
        table.appendChild(row);

        //Table rows
        for(let i = 0; i < json.length; i++){
            let row = document.createElement("tr");
            //give the # for every movie first
            let numTd = document.createElement("td");
            numTd.innerHTML = parseInt(i + 1);
            row.appendChild(numTd);
            //create td element for every movie in the object
            //and append to the row
            for(let el in json[i]){
                let td = document.createElement("td");
                td.innerHTML = json[i][el];
                row.appendChild(td);
            }
            //append current row to the table
            table.appendChild(row);
        }
        //add the whole table to the page
        document.getElementById("dataTable").appendChild(table);
    }

    /**
     * Clear previous data/input for input boxes, table, headings
     * Called in both find functions
     */
    function clearData() {
        document.getElementById("firstNameAll").value = "";
        document.getElementById("lastNameAll").value = "";
        document.getElementById("firstNameKB").value = "";
        document.getElementById("lastNameKB").value = "";
        document.getElementById("KevinBacon").innerHTML = "";
        document.getElementById("dataTable").innerHTML = "";
        document.getElementById("heading").innerHTML = "";
        document.getElementById("subheading").innerHTML = "Searching...";
    }

    /** 
     * returns the response text if the status is in the 200s
     * otherwise rejects the promise with a message including the status
     */ 
    function checkStatus(response) {  
        if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } else if (response.status == 404) {
            // sends back a different error when we have a 404 than when we have
            // a different error
            return Promise.reject(new Error("Sorry, we couldn't find that page")); 
        } else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
    }
}) ();
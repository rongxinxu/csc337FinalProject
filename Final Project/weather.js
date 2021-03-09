/**
 * University of Arizona
 * CSC337 Final Project
 * Author: Vincent Xu
 * NetID: rongxinxu
 * Last edited date: 12/1/18
 * 
 *  This JavaScript file is to add any actions/events for weather.html
 *  User can search the weather of their current city
 *  Going to GET data from openweather.org by using WebAPI key
 *  Display the result to the page
 *  Also POST the history to a file and display all search histories to the page
 *  When one of the history button is clicked:
 *      the value of search bar will filled with the current history city name
 *      for the next search
 */

"use strict";
(function () {

    //window.onload call startUp function
    window.addEventListener("load", startUp);
    /**
     * 1. initialize the page
     * 2. add events to buttons
     * 3. getHistory from file every seconds
     */
    function startUp() {
        home();
        setInterval(getHistory, 1000);
        document.getElementById("go").onclick = search;
        document.getElementById("home").onclick = home;
    }

    /**
     * Initialize the tags/elements
     * Display area should be hidden when the page is loaded
     * Input, error message, and history shoudld blank
     */
    function home() {
        document.getElementById("display").style.visibility = "hidden";
        document.getElementById("weather").style.visibility = "hidden";
        document.getElementById("searchBar").value = "";
        document.getElementById("errorMessage").innerHTML = "";
        document.getElementById("contain").innerHTML = "";
    }

    /**
     * This function do the main thing
     * Regular Expression: validation for user input city name
     * /^[a-zA-Z][a-zA-Z\s']+$/
     * Fetch (GET) using API key to get data from openweathermap.org
     * Display result to the page
     * and error message if cannot get any result
     */
    function search() {
        //API secrect key
        let apiKey = "5a5b5bdc347ac14dd2b749d5caf98479";
        document.getElementById("errorMessage").innerHTML = "";

        let city = document.getElementById("searchBar").value;
        console.log(city);

        //regular expression (city name must match the format)
        let cityName = city.match(/^[a-zA-Z][a-zA-Z\s']+$/);
        //if not, display error message
        if(cityName === null){
            document.getElementById("errorMessage").innerHTML = 
            "* Please Enter a valid city name *";
            console.log("false");
        }
        else{
            document.getElementById("weather").innerHTML = "";
            document.getElementById("contain").innerHTML = "";
            //encode URL special characters " " & " ' "
            city = encodeURIComponent(cityName).replace(/'/g, "%27");
            let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
            console.log(url);

            fetch (url)
                .then(checkStatus)
                .then(function(responseText) {
                    let json = JSON.parse(responseText);
                    
                    //display area become visible
                    document.getElementById("display").style.visibility = "visible";
                    document.getElementById("weather").style.visibility = "visible";

                    // City & Country
                    let h2 = document.createElement("h2");
                    h2.innerHTML = `${json.name}, ${json.sys.country}`;
                    document.getElementById("weather").appendChild(h2);

                    //Get weather icon
                    let img = document.createElement("img");
                    let iconURL = `http://openweathermap.org/img/w/${json.weather[0].icon}.png`;
                    img.src = iconURL;
                    h2.appendChild(img);

                    //Calculate Fahrenheit & Celsius
                    let fahrenheit = parseInt((json.main.temp - 273.15) * (9 / 5) + 32);
                    let celsius = parseInt(json.main.temp - 273.15);
                    let span = document.createElement("span");
                    span.innerHTML = `${celsius}&degC / ${fahrenheit}&degF`;
                    span.id = "degree";
                    h2.appendChild(span);

                    //Get Infos (add classlist)
                    for(let i = 0; i < 5; i++){
                        let div = document.createElement("div");
                        div.classList.add("descriptions");
                        document.getElementById("weather").appendChild(div);
                    }
                    //display weather infos from Web API
                    let descriptDivs = document.querySelectorAll(".descriptions");
                    descriptDivs[0].innerHTML = `Description: ${json.weather[0].description}`;
                    descriptDivs[1].innerHTML = 
                    `Geographic Coordinate: [${json.coord.lat}, ${json.coord.lon}]`;
                    descriptDivs[2].innerHTML = `Pressure: ${json.main.pressure} hPa`;
                    descriptDivs[3].innerHTML = `Humidity: ${json.main.humidity} %`;
                    descriptDivs[4].innerHTML = `Wind Speed: ${json.wind.speed} m/s`;

                    //set different GIF background (based on weather description)
                    //Group 2xx: Thunderstorm       Group 800: Clear    Group 80x: Clouds
                    //Group 3xx: Drizzle            Group 5xx: Rain
                    //Group 6xx: Snow               Group 7xx: Atmosphere
                    //add class name
                    let weatherID = json.weather[0].id.toString();
                    if(weatherID === "800"){
                        document.getElementById("weather").className = "clearSky";
                    }
                    else if(weatherID.match(/^80[1-4]$/)){
                        document.getElementById("weather").className = "cloud";
                    }
                    else if(weatherID.match(/^[5|3][0-9]{2}$/)){
                        document.getElementById("weather").className = "rain";
                    }
                    else if(weatherID.match(/^2[0-9]{2}$/)){
                        document.getElementById("weather").className = "thunder";
                    }
                    else if(weatherID.match(/^6[0-9]{2}$/)){
                        document.getElementById("weather").className = "snow";
                    }
                    else if(weatherID.match(/^7[0-9]{2}$/)){
                        document.getElementById("weather").className = "mist";
                    }

                    //post history to a file
                    postHistory();
                    //getHistory();
                })
                //if get any error from fetch, display to the page
                .catch(function(error) {
                    console.log(error);
                    document.getElementById("weather").style.visibility = "hidden";
                    document.getElementById("errorMessage").innerHTML = 
                    "* NOT FOUND *";
            });
        }
    }

    /**
     * When search button is clicked
     * Get the current city name just searched and store in a file
     * Using POST Method
     */
    function postHistory(){
        //store search bar value and clear
        let name = document.getElementById("searchBar").value;
        document.getElementById("searchBar").value = "";
        const message = {name: name};
        console.log(message);
        
        //POST
        const fetchOptions = {
            method : 'POST',
            headers : {
                'Accept': 'application/json',
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(message)
        };
        
        //POST method to store the data in a file
        let url = "http://localhost:3000";
        fetch (url, fetchOptions)
            .then(checkStatus)
            .then(function(responseText) {
                console.log(responseText);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    /**
     * GET method to get the search history from file
     * Display all results on the history area
     * Each history is a button
     * When user clicked on the button, display current history value on search bar
     */
    function getHistory() {
        document.getElementById("contain").innerHTML = "";
        let url = "http://localhost:3000/";
        fetch (url)
            .then(checkStatus)
            .then(function(responseText) {
                let json = JSON.parse(responseText);

                //display history data to history area as buttons
                if(json.length != 0){
                    for(let i = json.length - 1; i >= 0; i--){
                        let li = document.createElement("li");
                        li.innerHTML = json[i];
                        li.id = json[i];
                        li.classList.add("list");   //classList "list", have the same format
                        document.getElementById("contain").appendChild(li);
                        li.addEventListener("click", showCity);
                    }
                }
            })
            .catch(function(error) {
                console.log(error);
        });
    }

    /**
     * EventListener onclick event for each history "button"
     * When each button is clicked
     *      search bar should display current button's value
     */
    function showCity() {
        console.log(this.id);
        document.getElementById("searchBar").value = this.id;
    }

    /**
     * Returns the response text if the status is in the 200s
     * Otherwise rejects the promise with a message including the status
     *  * @param {response from the server} response 
     */
    function checkStatus(response) {  
        if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } else if (response.status === 404) {
            // sends back a different error when we have a 404 than when we have
            // a different error
            return Promise.reject(new Error("Sorry, we couldn't find that page")); 
        } else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
    }
}) ();
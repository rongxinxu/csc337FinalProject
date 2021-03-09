/**
 * University of Arizona
 * CSC337 HW6 : Gerrymandering
 * Author: Vincent Xu
 * NetID: rongxinxu
 * Due Date: 10/17/2018
 * This JavaScript file is to receive data from the gerrrymandering server,
 * Display the informations of chosen state and determine whether Gerrymandered or not.
 */

"use strict";
(function () {

    window.addEventListener("load", startUp);
    /**
     * Button is ready to be clicked when the page finished loading
     */
    function startUp() {
        let search = document.getElementById("search");
        search.onclick = searchAll;
    }

    /**
     * Receive state name and districts data from the server when "search" is clicked
     * Display state's name, Gerrymandered or not, eligible voters, and data from both party
     * Display Error Message when:
     *      - the state missing some data, 
     *      - failed to fetch, 
     *      - searching a wrong state's name
     * Display data Bars for both party. Set style (blue / red)
     */
    function searchAll() {
        //Initially these divs are empty
        document.getElementById("statename").innerHTML = "";
        document.getElementById("voters").innerHTML = "";
        document.getElementById("statedata").innerHTML = "";
        document.getElementById("errors").innerHTML = "";

        //get state's name from user input
        let input = document.getElementById("box").value;

        let url = "http://localhost:3000?state=" + input + "&type=districts";
        //let url = "notfound.js";
        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                //parse it to a JavaScript Object
                let json = JSON.parse(responseText);
                //display state name on page <h2>
                let h2 = document.createElement("h2");
                h2.innerHTML = json.state;
                let statename = document.getElementById("statename");
                statename.appendChild(h2);

                //local variables
                let dem;
                let gop;
                let demWasted = 0;
                let gopWasted = 0;
                let totalDemWasted = 0;
                let totalGopWasted = 0;
                let votesToWin = 0;
                let demTotalVotes = 0;
                let gopTotalVotes = 0;

                //get datas from every districts and determine gerrymandering for states
                for(let i = 0; i < json.districts.length; i++){
                    dem = parseInt(json.districts[i][0]);
                    gop = parseInt(json.districts[i][1]);
                    //"votesToWin" only used for calculate wasted votes  
                    votesToWin = parseInt((dem + gop) / 2) + 1;

                    //if the districts is missing data (empty)
                    //ignore it
                    if(!dem && !gop){
                        continue;
                    }
                    // get waste votes from both sides
                    if(dem <= votesToWin){
                        demWasted = dem;
                    }
                    else{
                        demWasted = dem - votesToWin;
                    }
                    if(gop <= votesToWin){
                        gopWasted = gop;
                    }
                    else{
                        gopWasted = gop - votesToWin;
                    }

                    //get total votes & total wasted votes from the states (both party) 
                    demTotalVotes += dem;
                    gopTotalVotes += gop;
                    totalDemWasted += demWasted;
                    totalGopWasted += gopWasted;
                        
                    console.log(dem, gop);

                    //add state datas, and set style
                    let demDiv = document.createElement("div");
                    let gopDiv = document.createElement("div");
                    demDiv.className = "dem";
                    demDiv.style.width = parseInt(dem * 100 / (dem + gop)) + "%";
                    //console.log(parseInt(dem * 100 / (dem + gop))*100 + "%");
                    gopDiv.className = "gop";
                    gopDiv.appendChild(demDiv);
                    document.getElementById("statedata").appendChild(gopDiv);
                }
                console.log(json);

                //determine whether gerrymandered or not
                let diff = Math.abs(totalDemWasted - totalGopWasted);
                let totalVotes = demTotalVotes + gopTotalVotes;

                //consider a state gerrymandered 
                //when there is a 7% or greater difference in the wasted votes.
                //Add this data as an h3 to the top of the statedata div
                let h3 = document.createElement("h3");
                if(diff / totalVotes >= 0.07){
                    if(totalDemWasted < totalGopWasted){
                        h3.innerHTML = "Gerrymandered to favor the Democratic Party";
                    }
                    else if(totalGopWasted < totalDemWasted){
                        h3.innerHTML = "Gerrymandered to favor the Republican Party";
                    }
                }else {
                    h3.innerHTML = "Not gerrymandered";
                }
                document.getElementById("voters").appendChild(h3);
                //called getVoters() to receive eligible voters
                getVoters(input);
            
            })
            .catch(function(error) {
                //display errors on page
                let h1 = document.createElement("h1");
                h1.innerHTML = error; //+ " There was no data for the chosen state.";
                document.getElementById("errors").appendChild(h1);
                console.log(error.message);
            });
    }

    /**
     * Get Eligible voters from the servers
     * Display data on page with <h4> element (added to html file)
     * Display Error Message if:
     *      - failed to fetch
     *      - cannot found file
     * @param {stateName} input 
     */
    function getVoters(input) {
        let url = "http://localhost:3000?state=" + input + "&type=voters";
        //let url = "notfound.js";
        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                //parse it to a JavaScript Object
                let json = JSON.parse(responseText);
                //create h4 element and put the voters number in there
                let h4 = document.createElement("h4");
                h4.innerHTML = json + " eligible voters";
                //append <h4> into the voters div
                let voters = document.getElementById("voters");
                voters.appendChild(h4);
            })
            .catch(function(error) {
                //display errors on page
                let h1 = document.createElement("h1");
                h1.innerHTML = error; //+ " There was no data for the chosen state.";
                document.getElementById("errors").appendChild(h1);
                console.log(error);
                console.log(error.message);
            });
    }

    /**
     * Returns the response text if the status is in the 200s
     * Otherwise rejects the promise with a message including the status
     * @param {response from the server} response 
     */
    function checkStatus(response) {  
        if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } else if (response.status === 404) {
            console.log(response.status);
            // sends back a different error when we have a 404 than when we have
            // a different error
            return Promise.reject(
                new Error(response.status + ": Sorry, we couldn't find that page")
            ); 
        }else {  
            console.log(response.status);
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
    }
}) ();
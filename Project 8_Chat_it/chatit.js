/**
 * University of Arizona
 * CSC337 Homework Assignment 8 Chat-It
 * Author: Vincent Xu
 * NetID: rongxinxu
 * Due Date: 10/31/2018
 * This JavaScript file to send the message to the service using POST
 * And refresh the comment every 5 seconds, get the new comments from service
 * Replace the old comments
 */
"use strict";
(function () {
    
    window.addEventListener("load", startUp);
    /**
     * Button is ready to be clicked when the page finished loading
     * refresh comments every 5 seconds
     * when the page loaded, get comments from server
     */
    function startUp() {
        refreshComments();
        setInterval(refreshComments, 5000);
        document.getElementById("send").onclick = send;
    }

    /**
     * when the user clicked "Send"
     * the contents of name and comments should be sent to the service 
     * as a POST request
     */
    function send(){
        let comment = document.getElementById("input").value;
        let userName = document.getElementById("name").value;
        //let data = [];

        if(userName === "" || comment === ""){
            alert("Name / Message cannot be empty. Failed");
        }
        
        else{
            const message = {name: userName,
                            comment: comment};
            //console.log(message);
        
            //POST
            const fetchOptions = {
                method : 'POST',
                headers : {
                    'Accept': 'application/json',
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(message)
            };
            
            let url = "http://localhost:3000";
            //let url = "/messages.txt";
            fetch (url, fetchOptions)
                .then(checkStatus)
                .then(function(responseText) {
                    // refreshComments();
                    // alert(responseText);
                    console.log(responseText);
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
        //refreshComments();
    }

    /**
     * This refresh function is to get all comments from services
     * Insert them into the page
     * Name and Comments inserted in different tags
     */
    function refreshComments(){
        let box = document.getElementById("box");
        box.innerHTML = "";
        
        let url = "http://localhost:3000";
        fetch (url)
            .then(checkStatus)
            .then(function(responseText) {
                let json = JSON.parse(responseText);
                console.log(json);
                
                //name and comment inserted in different tags
                for(let i = 0; i < json.messages.length; i++){
                    let p = document.createElement('p');
                    p.innerHTML = `${json.messages[i].name}: `;
                    let div = document.createElement('div');
                    div.className = "comments"; //add classname of every comments
                    div.innerHTML = `"${json.messages[i].comment}"`;
                    p.appendChild(div);
                    //console.log(p);
                    document.getElementById("box").appendChild(p);
                }

                //keep display the bottom of the message box, even refresh the page 
                //display latest messages
                box.scrollTop = box.scrollHeight;
                //console.log(responseText);
            })
            .catch(function(error) {
                console.log(error);
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
            // sends back a different error when we have a 404 than when we have
            // a different error
            return Promise.reject(new Error("Sorry, we couldn't find that page")); 
        } else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
    }
}) ();
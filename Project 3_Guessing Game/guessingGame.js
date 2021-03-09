/**
 * University of Arizona CSC337 HW3
 * Author: Vincent Xu
 * Due Date: 9/14/18
 * The purpose of this JavaScript file:
 * -    Generate a random number when "start" is pressed.
 * -    Clear any previous guesses or win information listed when "start" is pressed.
 * -    Read the users guess and print out a response when "guess" button is pressed.
 */

"use strict";
(function () {
    let correctNum = 0;

    /**
     * When the page is opened, load HTML first to get the elements
     * Run the JavaScript later
     * So we can get the elements' ID or class name
     */
    function startUp() {
        let guessButton = document.getElementById("guess");
        let startButton = document.getElementById("start");
        guessButton.onclick = guess;
        startButton.onclick = start;
    }

    window.onload = startUp;

    /**
     * click start button
     * then get a random number between min-max
     * clear any previous guesses or win information
    */
    function start() {
        let min = parseInt(document.getElementById("minimum").value);
        let max = parseInt(document.getElementById("maximum").value);
        if(!min || !max){
            alert("Please provide Min/Max number! And restart");
        }
        else {
            if(min > max){
                alert("Minmium cannot exceed Maximum number!");
            }
            else {
                correctNum = randomInt(min, max);
                alert(`A Random number from ${min} to ${max} is generated! Start guessing.`);
                console.log("Random number: " + correctNum);
            }
        }
        //clear input value and any previous guesses
        // or win information listed on the page
        document.getElementById("input").value = "";
        document.getElementById("information").innerHTML = "";
    }

    /**
     * Getting Random Interge between min and max
     * @ Passing parameters: minimum and maximum number
     * @ Return a random number
    */
    function randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Run, when Pressing Guess button
     * Check input number with the random number
     * Print any previous guesses or win information
    */
    function guess() {
        let min = parseInt(document.getElementById("minimum").value);
        let max = parseInt(document.getElementById("maximum").value);
        if(correctNum){
            if(min && max){
                let inputNum = parseInt(document.getElementById("input").value);
                let textnode;
                //console.log(inputNum);
                if (!inputNum || inputNum < min || inputNum > max) {
                    alert("Please provide valid Guess number!");
                    document.getElementById("input").value = "";
                }
                else {
                    if (inputNum < correctNum) {
                        textnode = document.createTextNode("more than " + inputNum);
                    }
                    else if (inputNum > correctNum) {
                        textnode = document.createTextNode("less than " + inputNum);
                    }
                    else {
                        textnode = document.createTextNode("you got it right!");
                    }
                    //create <div> element with className:"guesses" in html
                    let node = document.createElement("div");
                    //Add class name "guesses" to <div> elements
                    node.className = "guesses"; //node.setAttribute("class", "guesses");

                    //add the text content inside the <div> element
                    node.innerHTML = textnode.nodeValue;    //node.appendChild(textnode);
                
                    //add those <div> in an element with Id name "information"
                    //Guesses should be added to the top of the paragraph
                    let temp = document.getElementById("information");
                    temp.insertBefore(node, temp.childNodes[0]);

                    // //other way to do: (but bad style)
                    // let stuff = document.getElementById("information");
                    // stuff.innerHTML = textnode.nodeValue + "<br />" + stuff.innerHTML;
                }
            }
            else {
                alert("Please provide valid Min/Max number! And restart");
            }
        }
        else {
            alert('Please click "Start" to generate a random Number first!');
        }
    }
}) ();
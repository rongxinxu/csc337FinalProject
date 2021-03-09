"use strict";
/**
 * University of Arizona
 * CSC337 Homework Assignment 4
 * SpeedReader
 * Author: Vincent Xu
 * NetID: rongxinxu
 *      This is the JavaScript file for "speedreader.html"
 * Features:
 *      -Reader Box for animation
 *      -Enabling/Disabling for "Start" and "Stop"
 *      -When "Start" clicked, word display animation begins.
 *      -A drop-down list of speeds.
 *         One of the speeds is chosen, it immediately sets the speed
 *      -Change different font sizes
 *      -TextBox for inputs
 */

//Anonymous function
(function () {
    //"use strict";

    //global variables
    let array = [];
    let timer = null;
    let index = 0;

    window.addEventListener("load", run);
    /**
     * Call .addEventListener, can run this function when the page is loaded
     */
    function run() {
        let startButton = document.getElementById("start");
        let stopButton = document.getElementById("stop");
        startButton.onclick = start;
        stopButton.onclick = stop;
        stopButton.disabled = true;

        //For changing speed
        let speedSelect = document.getElementById("wpm");
        speedSelect.onchange = changeSpeed;

        //For changing Font size
        let mediumFont = document.getElementById("medium");
        let bigFont = document.getElementById("big");
        let biggerFont = document.getElementById("bigger");
        mediumFont.onchange = medium;
        bigFont.onchange = big;
        biggerFont.onchange = bigger;
    }

    /**
     * @ Run when Start button clicked
     * @ Get value of speed and sizes selected, and the message from input
     * @ Set a time for displayed the words on readerBox
     * @ Displayed the words with every delay MS （speed)
     * @ If the word with punctuations, displayed twice the normal amount of time
     */
    function start() {
        let inputText = document.getElementById("inputBox").value;
        if(!inputText){
            alert("Please Enter Some Message!");
        }
        else{
            //once "start" clicked, it disabled and "stop" can clicked
            document.getElementById("start").disabled = true;
            document.getElementById("stop").disabled = false;
            //can not edit input text once "start" clicked
            document.getElementById("inputArea").disabled = true;

            //seperate words
            array = inputText.split(/[ \t\n]+/);

            //get current speed and its wpm text for alert
            let currentSpeed = document.querySelector("select").value;
            currentSpeed = parseInt(currentSpeed);
            let wpm = document.getElementById("wpm");
            let wpmText = wpm.options[wpm.selectedIndex].text;

            //get selected font size
            let inputsFontSize = document.querySelectorAll('input');
            let setSize;
            for(let i = 0; i< inputsFontSize.length; i++){
                if(inputsFontSize[i].checked){
                    setSize = parseInt(inputsFontSize[i].value);
                }
            }
            console.log("Current fontsize: " + setSize);
            console.log(currentSpeed);
            console.log(wpmText);

            // let fontsize = document.getElementById("fontsize").checked;
            // console.log(fontsize + " pt");
            alert(`Your messages will displayed in words with:
                every ${currentSpeed}ms/${wpmText} in font: ${setSize} pt`);//${fontsize}

            //check isPunctuation
            for(let i = 0; i < array.length; i++) {
                let wordlen = array[i].length;

                /**
                 * check the end of a word
                 * word should be displayed for twice the normal amount of time
                 * So added one more word (the ones end with any Punctuation)
                 */
                if(wordIsPunctuation(array[i]))
                {
                    //delete the last punctuation
                    array[i] = array[i].substring(0, wordlen - 1);
                    /**
                     * array.splice(index, howmany, item1, ....., itemX)
                     * index: what position to add/remove items
                     * howmany: The number of items to be removed.
                     *      If set to 0, no items will be removed
                     * item1~X: The new item(s) to be added to the array
                     */
                    array.splice(i, 0, array[i]);
                    i++;
                }
            }
            //console.log(array);
            if(timer == null){
                timer = setInterval(tick, currentSpeed, array);
            }
        }
    }

    /**
     * Check the word either with punctuations or not
     * @param {word} word
     * return true: if last letter of the word with punctuations
     * return false: no punctuations
     */
    function wordIsPunctuation(word) {
        if(word.charAt(word.length - 1) === ','|| word.charAt(word.length - 1) === '.' ||
        word.charAt(word.length - 1) === '!' || word.charAt(word.length - 1) === '?' ||
        word.charAt(word.length - 1) === ';' || word.charAt(word.length - 1) === ':')
        {
            return true;
        }
        return false;
    }

    /**
     * displayed the words on "readerBox" every currentSpeed(ms)
     */
    function tick(array) {
        if(index < array.length){
            document.getElementById("readerBox").innerHTML = array[index];
            index++;
        }
        //reached the end
        else if(index === array.length){
            stop();
        }
        else {  //for debug
            alert("Oops, something wrong!");
        }
    }

    /**
     * @ Once the speed has changed, remind the user
     * @ And displayed the words with new speed
     */
    function changeSpeed() {
        let speed = parseInt(document.getElementById("wpm").value);
        let wpm = document.getElementById("wpm");
        let wpmText = wpm.options[wpm.selectedIndex].text;
        alert(`Speed changed to: ${speed} ms/ ${wpmText}`);
        //if the animation is running, but change speed
        if(timer != null){
            //clears a timer set, then continue with new speed
            clearInterval(timer);
            timer = setInterval(tick, speed, array);
        }
    }

    /**
     * function for "stop" Button
     * When animation is stopped/button clicked,
     *       - the div"readerBox" should become blank.
     */
    function stop() {
        //Once "stop" clicked/reach the last word,
        //It disabled and "start" can clicked and re-edit input text
        document.getElementById("start").disabled = false;
        document.getElementById("stop").disabled = true;
        document.getElementById("inputArea").disabled = false;
        document.getElementById("readerBox").innerHTML = "";
        ////clears a timer set / reset
        clearInterval(timer);
        timer = null;
        index = 0;
    }

    /**
     * Set Medium font size when the size has changed (36pt)
     */
    function medium() {
        let size = parseInt(document.getElementById("medium").value);
        console.log("Font size changed to:" + size + " pt.");
        //alert(`Font size changed to: ${size}pt (Medium).`);
        document.getElementById("readerBox").style.fontSize = size + "pt";
    }

    /**
     * Set Big font size when the size has changed (48pt)
     */
    function big() {
        let size = parseInt(document.getElementById("big").value);
        console.log("Font size changed to:" + size + " pt.");
        //alert(`Font size changed to: ${size}pt (Big).`);
        document.getElementById("readerBox").style.fontSize = size + "pt";
    }

    /**
     * Set Bigger font size when the size has changed (60pt)
     */
    function bigger() {
        let size = parseInt(document.getElementById("bigger").value);
        console.log("Font size changed to:" + size + " pt.");
        //alert(`Font size changed to: ${size}pt (Bigger).`);
        document.getElementById("readerBox").style.fontSize = size + "pt";
    }
}) ();
/**
 * University of Arizona
 * CSC337 Homework Assignment 9 Paint (Canvas)
 * Author: Vincent Xu
 * NetID: rongxinxu
 * Due Date: 11/7/2018
 * This JavaScript is to draw picture into the canvas in paint.html
 * ColorPicker, PenSize, Main Drawing Board
 * Also Add Events for buttons and mouse
 * Set & update the penSize and color for drawing 
 */

"use strict";
(function () {
    //global varibles
    let penSize = 1; //radius of circle
    let penColor = "black"; //default color
    let mode = "pen"; //default mode

    /**
     * When the page loaded, draw colorPicker, defalut pen Size&Color
     * Add Events for every buttons
     * & Add Events for mouse
     */
    window.onload = function(){
        //For drawing controls:
        document.getElementById("plus").onclick = increPenSize;
        document.getElementById("minus").onclick = decrePenSize;
        document.getElementById("colorPicker").onclick = getColor;
        createColorPicker();
        drawPenSize();

        console.log("mode: " + mode);

        //Add/Remove events for the canvas
        let canvas = document.getElementById("canvasBoard");
        canvas.addEventListener("mouseover", over);
        canvas.addEventListener("mouseup", removeEvent);
        canvas.onclick = linesClicked;

        //Clicked buttons, and change modes
        document.getElementById("penButton").onclick = pen;
        document.getElementById("circlesButton").onclick = circle;
        document.getElementById("squaresButton").onclick = square;
        document.getElementById("linesButton").onclick = lines;
        //Clear Mode, and make the canvas to be initialize: white background
        document.getElementById("clearButton").onclick = clearMode;
    };

    /**
     * If its lines mode, and clicked on the drawing board
     * draw a line to where the mouse located
     */
    function linesClicked() {
        if(mode === "lines") { 
            linesMode();
        }
    }

    /**
     * Move To the current location where the mouse is 
     * And get ready to draw ONCE the mouse is clicked down
     * @param {canvas Event} event 
     */
    function over(event) {
        let canvas = document.getElementById("canvasBoard");
        let context = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        context.beginPath();
        //start with the position where the mouse clicked down
        context.moveTo(event.clientX - rect.left, event.clientY - rect.top);
        canvas.addEventListener("mousedown", down);
    }
    
    /**
     * starts a drawing where the mouse is 
     * when it first clicked down the canvas.
     * draw follow the mouse when its moving
     * @param {canvas Event} event 
     */
    function down(event){
        let canvas = document.getElementById("canvasBoard");
        let context = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        context.beginPath();
        //start with the position where the mouse clicked down
        context.moveTo(event.clientX - rect.left, event.clientY - rect.top);
        canvas.addEventListener("mousemove", draw);
    }

    /**
     * remove the event if the mouse is up
     */
    function removeEvent() {
        let canvas = document.getElementById("canvasBoard");
        canvas.removeEventListener("mousemove", draw);
    }

    /**
     * Drawing the color picker on canvas
     * Create gradient show color red, blue, green, yellow horizontally
     * white to black vertically
     */
    function createColorPicker() {
        //Color Picker
        let colorCanvas = document.getElementById("colorPicker");
        let context = colorCanvas.getContext("2d");
        
        // creates a horizontal gradient from red to green to blue
        let gradient = context.createLinearGradient(0,0,colorCanvas.width,0);
        gradient.addColorStop(0, "rgb(255, 0, 0)");
        gradient.addColorStop(0.15, "rgb(255, 0, 255)");
        gradient.addColorStop(0.33, "rgb(0, 0, 255)");
        gradient.addColorStop(0.49, "rgb(0, 255, 255)");
        gradient.addColorStop(0.67, "rgb(0, 255, 0)");
        gradient.addColorStop(0.84, "rgb(255, 255, 0)");
        gradient.addColorStop(1, "rgb(255, 0, 0)");
        context.fillStyle = gradient;
        context.fillRect(0,0,colorCanvas.width,colorCanvas.height);
        
        // puts a vertical gradient from clear to black over the top 
        // of the previous gradient
        let gradient2 = context.createLinearGradient(0,0,0,colorCanvas.height);
        gradient2.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient2.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient2.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        gradient2.addColorStop(1, "rgba(0, 0, 0, 1)");
        context.fillStyle = gradient2;
        context.fillRect(0,0,colorCanvas.width,colorCanvas.height);
    }

    /**
     * Draw the pen sizes on canvas once the size and color has changed
     * Global variables: penSize, penColor
     * Draw circle
     */
    function drawPenSize() {
        let canvas = document.getElementById("penCanvas");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // console.log(canvas.width,canvas.height);
        ctx.fillStyle = penColor;
        ctx.beginPath();
        ctx.arc((canvas.width / 2), (canvas.height / 2), penSize, 0, 2 * Math.PI);
        ctx.fill();
    }

    /**
     * Get the color of the pixel when user clicked on the color picker
     * Update Global variable penColor and called penSize function with new color
     * @param {current event} event 
     */
    function getColor(event) {
        let canvas = document.getElementById("colorPicker");
        let context = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        let data = context.getImageData(event.clientX - rect.left, event.clientY - rect.top, 1, 1);
        // console.log("red:  " + data.data[0] + " green: " + 
        //          data.data[1] + " blue: " + data.data[2]); 
        
        penColor = `rgb(${data.data[0]}, ${data.data[1]}, ${data.data[2]})`;
        drawPenSize();
    }

    /**
     * Increase the penSize by one when plus button is clicked
     * Maximum size: 25
     * Draw penSize with new size
     */
    function increPenSize() {
        penSize++;
        if(penSize > 25){
            penSize = 25;
        }
        drawPenSize();
    }

    /**
     * Decrease the penSize by one when minus button is clicked
     * Minimum size: 1
     * Draw penSize with new size
     */
    function decrePenSize() {
        penSize--;
        if(penSize < 1){
            penSize = 1;
        }
        drawPenSize();
    }

    /**
     * Change global variable mode to penMode
     */
    function pen() {
        mode = "pen"; 
        console.log("mode: " + mode);
    }

    /**
     * Change global variable mode to circleMode
     */
    function circle() {
        mode = "circle"; 
        console.log("mode: " + mode);
    }

    /**
     * Change global variable mode to squareMode
     */
    function square() {
        mode = "square"; 
        console.log("mode: " + mode);
    }

    /**
     * Change global variable mode to linesMode
     */
    function lines() {
        mode = "lines";
        console.log("mode: " + mode);
    }

    /**
     * Clear button clicked, clear everything on main canvas board
     * Filled with a white rectangle with canvas width & height
     */
    function clearMode() {
        mode = "clear";
        console.log("mode: " + mode);
        let canvas = document.getElementById("canvasBoard");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.fill();
        // mode = "pen";   //change back to default mode (pen)
    }

    /**
     * Draw different pattern with different mode
     * Call the mode with specific mode 
     */
    function draw() {
        
        //draw line in the mouse's path
        if(mode === "pen"){
            penMode();
        }
        if(mode === "circle"){
            circleMode();
        }
        if(mode === "square") {
            squareMode();
        }
        if(mode === "lines") {
            linesMode();
        }
    }

    /**
     * Draw lines following the mouse path
     * with current pen Size and Color
     */
    function penMode() {
        let canvas = document.getElementById("canvasBoard");
        let context = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        context.strokeStyle = penColor;
        context.lineWidth = penSize;
        context.lineTo(event.clientX - rect.left, event.clientY - rect.top);
        context.stroke();
    }

    /**
     * Draw circle follow the mouse
     * with current pen Size and Color
     */
    function circleMode() {
        let canvas = document.getElementById("canvasBoard");
        let context = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        context.fillStyle = penColor;
        context.beginPath();
        context.arc(event.clientX - rect.left, event.clientY - rect.top, 
            penSize, 0, 2 * Math.PI);
        context.fill();
    }

    /**
     * Draw Square follow the mouse
     * with current pen Size and Color
     */
    function squareMode() {
        let canvas = document.getElementById("canvasBoard");
        let context = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        context.fillStyle = penColor;
        context.beginPath();
        context.fillRect(event.clientX - rect.left, event.clientY - rect.top, 
            penSize, penSize);
        context.fill();
    }

    /**
     * Draw straight line 
     * from the upper left corner to mouse's current location 
     * with current pen Size and Color
     */
    function linesMode() {
        let canvas = document.getElementById("canvasBoard");
        let context = canvas.getContext("2d");
        let rect = canvas.getBoundingClientRect();
        context.strokeStyle = penColor;
        context.lineWidth = penSize;
        context.moveTo(0, 0);   //left top corner
        //draw the line from left top to where the mouse located
        context.lineTo(event.clientX - rect.left, event.clientY - rect.top);
        context.stroke();
    }
}) ();
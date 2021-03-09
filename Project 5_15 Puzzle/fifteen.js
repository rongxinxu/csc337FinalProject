/**
 *  University of Arizona
 *  CSC337 HW5 Fifteen Puzzle
 *  Author: Vincent Xu
 *  NetID: rongxinxu
 *
 *  This JavaScript file is for "fifteen.html"
 *  Some Features:
 *      - when the pieces of tile is clicked, 
 *      check and move if the square is next to the blank square
 *      - if the square can move, and mouse hovers over, text and border color should be red
 *      otherwise, should be black (default)
 *      - shuffle puzzle
 *      - Background-Position for each squares
 *      - swap the square(can move) and the blank square.
 */

"use strict";
(function () {
    //"use strict";
    //global variables
    let emptyX = 300 + "px";
    let emptyY = 300 + "px";
    let check = -1;

    window.addEventListener("load", onloadRun);
    /**
     * Call .addEventListener, can run this function when the page is loaded
     */
    function onloadRun() {
        //Shuffle Button
        let shuffleButton = document.getElementById("shufflebutton");
        shuffleButton.onclick = shuffle;
        addAll();
    }

    /**
     * Add all pieces to the Puzzle when the page is loaded
     */
    function addAll() {
        //PuzzleArea
        let puzzle = document.getElementById("puzzlearea");

        //Create 15 divs for Puzzles
        for(let i = 0; i < 15; i++){
            //create div Elements
            let squares = document.createElement('div');
            //add classname and values
            squares.setAttribute("class", "pieces");
            squares.setAttribute("value", parseInt(i + 1));
            squares.innerText = parseInt(i + 1);

            //set background-position
            squares.style.top = parseInt(i / 4 ) * 100 + "px";
            squares.style.left = parseInt(i % 4 * 100) + "px";

            let positionX = "-" + squares.style.left;
            let positionY = "-" + squares.style.top;

            squares.style.backgroundPosition = positionX + ' ' + positionY;
            //add squares to the element with id"puzzlearea"
            puzzle.appendChild(squares);

            //add event for squares
            squares.onmouseover = hover;
            squares.onmouseout = noHover;
            squares.onclick = squaresMove;
        }
    }

    /**
     * When Shuffle Button clicked, the puzzle will shuffled
     */
    function shuffle() {
        console.log("shuffled");
        check = 1;
        for(let i = 0; i < 1000; i++){
            let neightbor = [];
            let allPieces = document.querySelectorAll('.pieces');
            
            for(let j = 0; j < 15; j++){
                let n = allPieces[j];
                let currX = n.style.left;
                let currY = n.style.top;
                if(letsMove(currX, currY)){
                    neightbor.push(n);
                }
            }
            let randomNum = parseInt(Math.random()*neightbor.length);
            swap(neightbor[randomNum]);
        }
        //pseudo-code
        /**
         * for (~1000 times):{
         *      neighbors = [].
         *      for each neighbor n that is directly 
         *      up, down, left, right from empty square:{
         *          if n exists and is movable:
         *              neighbors.push(n).
         *      }
         *      randomly choose an element i from neighbors.
         *      move neighbors[i] to the location of the empty square.
         * }
         */
    }

    /**
     * when clicked on the pieces
     * check and move if the neighbor piece is empty
     */
    function squaresMove() {
        if(check === -1){
            alert("Please Shuffle The Puzzle For New Game!");
        }
        else{
            let thisX = this.style.left;
            let thisY = this.style.top;
            if(letsMove(thisX, thisY)){
                swap(this);
                if(win() === true){
                    check = -1;
                    alert("Congratulation! You won! Click \"Shuffled\" again for a new game");
                }
            }
            else{
                alert("This tile cannot move");
            }
        }
    }

    /**
     * swap current pieces and the empty piece
     * swap their left&top position pixels
     * @param {current pieces} squares
     */
    function swap(squares){
        let templeft = squares.style.left;
        let temptop = squares.style.top;

        squares.style.left = emptyX;
        squares.style.top = emptyY;
        emptyX = templeft;
        emptyY = temptop;
    }

    /**
     * check neighbors the blank spot
     * if blank spot exists, the piece can move
     * @param {current left(X) position} x
     * @param {current top(Y) position} y
     */
    function letsMove(x, y) {
        let moveX = parseInt(emptyX);
        let moveY = parseInt(emptyY);
        let currentX = parseInt(x);
        let currentY = parseInt(y);
        //check if left, right, up, down is empty
        if(currentY === moveY){
            if((currentX === moveX - 100) || (currentX === moveX + 100)){
                return true;
            }
        }
        else if(currentX === moveX){
            if((currentY === moveY - 100) || (currentY === moveY + 100)){
                return true;
            }
        }else{
            return false;
        }
    }

    /**
     * Win when the positions of pieces are equal their original positions
     */
    function win() {
        let allPieces = document.querySelectorAll('.pieces');
        //console.log(allPieces);
        for(let i = 0; i < 15; i++){
            //console.log(allPieces[i].style.left);
            let x = allPieces[i].style.left;
            let y = allPieces[i].style.top;
            // console.log(x);
            // console.log(parseInt(i % 4 * 100) + "px");
            // console.log(y);
            // console.log(parseInt(i / 4 ) * 100 + "px");
            if(x !== parseInt(i % 4 * 100) + "px" || y !== parseInt(i / 4 ) * 100 + "px"){
                return false;
            }
        }
        return true;
    }

    /**
     * Hover on the puzzle pieces, and check if the pieces can MOVE
     * add className: "hover"
     * if the pieces can MOVE, then the border-color will set "red" in CSS
     */
    function hover() {
        //Get current position
        let thisX = this.style.left;
        let thisY = this.style.top;

        //if the pieces can move, hover red, and cursor with "pointer"
        if(letsMove(thisX,thisY)){
            this.style.color = "red";
            this.style.borderColor = "red";
            this.style.cursor = "pointer";
            //this.classList.add("hover");
        }
        //When the mouse cursor hovers over a square that cannot be moved,
        //set cursor to "default"
        else{
            this.style.color = "black";
            this.style.borderColor = "black";
            this.style.cursor = "default";
        }
    }

    /**
     * When the mouse leave the pieces, colors will be normal
     */
    function noHover() {
        this.style.color = "black";
        this.style.borderColor = "black";
        //this.style.cursor = "default";
        //this.classList.remove("hover");
    }

}) ();
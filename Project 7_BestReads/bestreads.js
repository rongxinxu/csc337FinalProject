/**
 * University of Arizona
 * CSC337 HW7 : Bestreads
 * Author: Vincent Xu
 * NetID: rongxinxu
 * Due Date: 10/24/2018
 * This JavaScript file is to make request to the server for data,
 * and add event for the button on the page
 * Display the response to the page
 */

"use strict";
(function () {
    
    window.addEventListener("load", startUp);
    /**
     * Button is ready to be clicked when the page finished loading
     */
    function startUp() {
        home();
        let homeButton = document.getElementById("back");
        homeButton.onclick = home;
    }

    /**
     * when the home button is clicked,
     * go back to the main page with all books
     */
    function home(){
        document.getElementById("allbooks").innerHTML = "";
        getData("books");
    }

    /**
     * First, set the mode to "books" to get all books from files
     * "singlebook" div do not display at the beginning
     * Get each books from the service.js
     * show the cover and title of the book
     * If the book is clicked, singlebook page display
     * @param {mode=="books"} mode 
     */
    function getData(mode){
        let singlebook = document.getElementById("singlebook");
        singlebook.style.display = "none";
        document.getElementById("title").innerHTML = "";
        document.getElementById("author").innerHTML = "";
        document.getElementById("stars").innerHTML = "";
        document.getElementById("description").innerHTML = "";
        document.getElementById("reviews").innerHTML = "";

        let url = "http://localhost:3000?mode=" + mode;
        console.log(url);
        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                //parse it to a JavaScript Object
                let json = JSON.parse(responseText);
                
                for(let i = 0; i < json.books.length; i++){
                    
                    let bookCover = document.createElement('div');
                    let booktitle = document.createElement('p');
                    let image = document.createElement('img');

                    //folder and title's name
                    let folderName = json.books[i].folder;
                    let bookname = json.books[i].title;
                    
                    booktitle.innerHTML = bookname;
                    //booktitle.className = filename;
                    let imageSrc = "books/" + folderName + "/cover.jpg";
                    image.src = imageSrc;
                    image.alt = folderName;
                    
                    //add book's cover (img) and title(p) to a 'div'
                    bookCover.appendChild(image);
                    bookCover.appendChild(booktitle);
                    bookCover.className = folderName;
                    bookCover.src = imageSrc;
                    //add all book to the page
                    document.getElementById("allbooks").appendChild(bookCover);

                    //when clicks on a book cover or title of a book
                    //display the info,description,reviews of this book ONLY
                    bookCover.onclick = singlebookInfo;
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    }
    
    /**
     * Display singlebook page ONLY
     * Mode == "info"
     * Get the information the book from the service
     * And get decription and reviews by calling functions
     */
    function singlebookInfo(){
        document.getElementById("allbooks").innerHTML = "";
        let singlebook = document.getElementById("singlebook");
        singlebook.style.display = "block";
        
        let url = "http://localhost:3000?mode=info&title="+this.className;
        //console.log(this.src);
        let coverImage = this.src;
        let className = this.className;
        
        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                //parse it to a JavaScript Object
                let json = JSON.parse(responseText);
                //console.log(json);
                document.getElementById("cover").src = coverImage;

                //display on page
                document.getElementById("title").innerHTML = json.title;
                document.getElementById("author").innerHTML = json.author;
                document.getElementById("stars").innerHTML = json.stars;

                //get description
                getDescription(className);
                //get reviews
                getReviews(className);
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    /**
     * Get description of the book from service
     * Mode=="description"
     * Display it on page
     * @param {classname of the singlebook} className 
     */
    function getDescription(className){
        let url = "http://localhost:3000?mode=description&title=" + className;

        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                //parse it to a JavaScript Object
                let json = JSON.parse(responseText);
                document.getElementById("description").innerHTML = json;
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    /**
     * Mode == "reviews"
     * Get reviews from the service
     * Add all reviews to the div and display on the page
     * @param {classname of the singlebook} className 
     */
    function getReviews(className){
        let url = "http://localhost:3000?mode=reviews&title=" + className;

        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                //parse it to a JavaScript Object
                let json = JSON.parse(responseText);
                
                for(let i = 0; i < json.reviews.length; i++){
                    let h3 = document.createElement('h3');
                    h3.innerHTML = json.reviews[i].name;
                    let span = document.createElement('span');
                    span.innerHTML = json.reviews[i].stars;
                    h3.appendChild(span);
                    let p = document.createElement('p');
                    p.innerHTML = json.reviews[i].review;
                    document.getElementById("reviews").appendChild(h3);
                    document.getElementById("reviews").appendChild(p);
                }
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
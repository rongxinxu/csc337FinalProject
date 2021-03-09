/**
 * University of Arizona
 * CSC337 HW7 : Bestreads
 * Author: Vincent Xu
 * NetID: rongxinxu
 * Due Date: 10/24/2018
 * This is the server file. The response from this server will depend on
 * four different mode and the title of the books
 * mode = "info"  send respond with the info of books
 * mode = "description" send respond as a string with the description of books
 * mode = "reviews" send respond with all reviews of the book
 * mode = "books" send respond with title of book and related folder
 */

const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static('public'));

    /**
 * read from the file, split line by line 
 * get info for the book from file (title, author, statrs)
 * Return all info from file as JSON oject
 * @param {file path} filename 
 */
function getInfo(filename){
    let lines = fs.readFileSync(filename, 'utf8').split('\n');

    //create a JSON object for info
    let infoData = {};
    //get book's info
    infoData["title"] = lines[0];
    infoData["author"] = lines[1];
    infoData["stars"] = lines[2];
    //console.log(infoData);
    return infoData;
}

/**
 * Get Description from file
 * Return as a String
 * @param {file path} filename 
 */
function getDescription(filename){
    return fs.readFileSync(filename, 'utf8');
}

/**
 * Read each reviews files.
 * Get name, stars, reviews from the files
 * Return as a JSON object
 * @param {file path} filename 
 */
function getReviews(filename){
    let lines = fs.readFileSync(filename, 'utf8').split('\n');

    let reviews = {};
    reviews["name"] = lines[0];
    reviews["stars"] = lines[1];
    reviews["review"] = lines[2];
    //console.log(reviews);
    return reviews;
}

/**
 * Read all file under the file called "books"
 * Get all books' title by Calling getInfo() function Store in an array
 * Also get the related folder name of the books
 * Return as a JSON object
 */
function getBooks(){
    let folder = fs.readdirSync("books/");
    //remove ".DS_Store" (MacBook ONLY)
    if(folder[0] == '.DS_Store'){
        folder.splice(0,1);
    }

    let allTitle = [];
    for(let i = 0; i < folder.length; i++){
        let infos = [];
        infos = getInfo("books/" + folder[i] + "/info.txt");
        allTitle.push(infos.title);
    }

    let data = {};
    data["books"] = [];

    for(let i = 0; i < folder.length; i++){
        let allbooks = {};
        allbooks["title"] = allTitle[i];
        allbooks["folder"] = folder[i];
        data["books"].push(allbooks);
    }
    //console.log(data["books"]);
    return data;
}

app.get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    let modeParam = req.query.mode;
    let titleParam = req.query.title;

    let filename;   // file name
    let filePath;   //for reading file
    filePath = "books/" + titleParam + "/";

    //four different mode: 
    //description, info, reviews or books
    let info;
    let description;
    let book;
    let allReviews = {};

    //when the mode is info
    if(modeParam === "info"){
        filename = filePath + "info.txt";
        info = getInfo(filename);
        res.send(JSON.stringify(info));
    }
    //when the mode is description
    else if(modeParam === "description"){
        filename = filePath + "description.txt";
        description = getDescription(filename);
        res.send(JSON.stringify(description));
    }
    //when the mode is reviews
    else if(modeParam === "reviews"){
        //get all file for the book
        let allfile = fs.readdirSync(filePath);
        //find all "review" files store into an array
        let reviewsArray = [];
        allfile.map((file) => {
            if(file.startsWith("review")){
                //console.log(file);
                reviewsArray.push(file);
            }
        });
        //run through all review files and store into the JSON object
        allReviews["reviews"] = [];
        for(let i = 0; i < reviewsArray.length; i++){
            filename = filePath + "review" + (i + 1) + ".txt";
            let reviews = getReviews(filename); 
            allReviews["reviews"].push(reviews);
        }
        res.send(JSON.stringify(allReviews));
    }
    ////when the mode is books
    else if(modeParam === "books"){
        book = getBooks();
        res.send(JSON.stringify(book));
    }
});

app.listen(3000);
//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const { Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const db = require('./queries');

const entries = [];
let day = 1;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

/*
app.get("/", function(req, res){
    const content = {
        homeStartingContent: homeStartingContent,
        entries: entries
    }
    res.render("home", content);
})
*/

app.get("/", db.getEntries)

app.get("/about", function(req, res){
    const content = {
        aboutContent: aboutContent
    }
    res.render("about", content);
})

app.get("/contact", function(req, res){
    const content = {
        contactContent: contactContent
    }
    res.render("contact", content);
})

app.get("/compose", function(req, res){
    const content = {
        day: entries.length + 1
    }
    res.render("compose", content);
})
/*
app.get("/entries/:entryTitle", function(req, res){
    const requestedTitle = req.params.entryTitle.toLowerCase();
    console.log(db.getEntryByTitle(requestedTitle, res));
    let match = false;
    entries.forEach(function(entry){
        const storedEntry = kebabCase(entry.title);
        if(requestedTitle == storedEntry){
            const content = {
                title: entry.title,
                post: entry.post
            }
            match = true;
            res.render("post", content);
        }
    })
    if(match === false){
        res.redirect("/");
    }
})*/


app.get("/entries/:entryTitle", db.getEntry)


app.post("/compose", function(req, res){
    res.redirect("/add/" + kebabCase(req.body.title) + "/" + req.body.post);
});

app.get("/add/:title/:post", db.addEntry)

app.post("/remove/:id", db.removeEntry)

app.listen(3000, function(){
    console.log("Server started on port 3000");
})

const kebabCase = string => string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
/*
const connectDb = async (query) => {
    try{
        const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT
        })
        await client.connect()
        const res = await client.query(query)
        console.log(res)
        await client.end();
    }catch(error){
        console.log(error);
    }
};

connectDb("SELECT * FROM mytable WHERE title = 'day-1'")
*/




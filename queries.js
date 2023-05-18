const dotenv = require('dotenv');
const ejs = require('ejs');
const Pool = require('pg').Pool;
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
})

const getEntries = (request, response) => {
    pool.query('SELECT * FROM mytable', (error, result) => {
        if(error){
            throw error;
        }
        const content = {
            homeStartingContent: homeStartingContent,
            entries: result.rows
        }
        response.render("home", content);
    }
    )
}

const getEntry = (request, response) => {
    const entryTitle = request.params.entryTitle;
    const myQuery = "SELECT * FROM mytable WHERE title = '" + entryTitle + "'";
    pool.query(myQuery, (error, result) => {
        if(error || result.rows.length == 0){
            response.render("error"); return;
        }
        const content = {
            id: result.rows[0].id,
            title: entryTitle,
            post: result.rows[0].post
        }
        response.render("post", content);
    }
    )
}

const removeEntry = (request, response) => {
    const myQuery = "DELETE FROM mytable WHERE id = " + parseInt(request.params.id);
    pool.query(myQuery, (error, result) => {
        if(error){
            throw error;
        }
        response.redirect("/");
    })
}

const addEntry = (request, response) => {
    const myQuery = "INSERT INTO mytable VALUES((SELECT max(id) + 1 FROM mytable),'" + request.params.title + "','" + request.params.post +"')";
    console.log(myQuery);
    pool.query(myQuery, (error, result) => {
        if(error){
            throw error;
        }
        response.redirect("/");
    })
}

module.exports = {
    getEntries,
    removeEntry,
    addEntry,
    getEntry
}
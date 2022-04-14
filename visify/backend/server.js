const express = require('express');
const fs = require('fs');
const pg = require('pg-promise')();
const app = express();
const port = 3000;
const path = require('path');
const bcrypt = require("bcrypt");

var bodyParser = require('body-parser');
const { info } = require('console');
var session = require('express-session');
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({secret:"yftfrdutdfuygihiuytfyds232345566", resave:false, saveUninitialized: true}))
app.use(session({ email: '', loggedin: false}));

//make sure you have postgres database set up with this information:
const dbConfig = {
    host: "localhost",
    port: 5432,
    database: "testdb1",
    user: "postgres",
    password: "cool23"
};

//Also make sure you have a table called "users" which consists of the following columns:
            //  Column  |          Type          | Collation | Nullable | Default
            // ----------+------------------------+-----------+----------+---------
            // id       | integer                |           | not null |
            // fullname | character varying(70)  |           |          |
            // email    | character varying(255) |           |          |
            // password | character varying(255) |           |          |

var db = pg(dbConfig);

//adds new user to users table on psql database
app.post('/sign_up', (req, res) => {
    var getMaxQuery = "SELECT MAX(id) FROM users;"
    var maxId = null;
    //id of new user will be max id + 1
    db.any(getMaxQuery)
        .then(function(rows){
            maxId = (rows[0].max) + 1;
            var rQ = req.body;
            //using the bycrypt function to encrypt the password, the 1 means how many times the salt will run through
            var salt = bcrypt.hashSync(rQ.password, 10);
            var addUserQuery = "INSERT INTO users VALUES ('" + (maxId) + "', '" + rQ.firstName + " " + rQ.lastName + "','" + rQ.email + "','" + String(salt) + "');"
            db.any(addUserQuery)
                .then(function(rows){
                    console.log(rows);
                })
                .catch(function(err){
                    console.log("error...");
                });
        })
        .catch(function(err){
            console.log("error...");
        });
    res.sendFile(path.join(__dirname + '/../static/index.html'));
});

app.post('/login', (req, res) =>{
    if(req.session.loggedin == true)
    {
        res.send("<a href = \"/\">Already logged in</a>");
        res.end();
    }
    else
    {
        var email = req.body.email;
        var password = req.body.password;
        // Ensure the input fields exists and are not empty
        if (email && password) {
            db.any(`SELECT * FROM users WHERE email = '${email}'`)
                .then(function(rows)
                {
                const user = rows[0];
                var result = bcrypt.compareSync(password, user.password);
                    if(result)
                    {
                        req.session.loggedin = true;
                        req.session.email = email;
                        res.status(200).redirect('/');
                        // Redirect to home page
                    }
                    else
                    {
                        res.status(400).send("<a href = \"/login\">Account with email and password requested not found. Click to go back.</a>");
                    }
                })
        }
    }
});

app.get('/logout', (req, res) =>{
    req.session.destroy(()=>{
        //req.logout();
        res.sendFile(path.join(__dirname + '/../static/index.html'));
        res.redirect('/');
    })
})

app.get('/checklogin', (req,res) =>{
    //res.json({loggedin: req.session.loggedin});
    if(req.session.loggedin == undefined)
    {
        req.session.loggedin = false;
    }
    res.send(JSON.stringify({loggedin: req.session.loggedin, email: req.session.email}));
})

// start listening
app.listen(port, (error) => {
    if (error) {
        console.error(`error: ${error}`);
    } else {
        console.log(`Listening on dev port ${port}...`);
    }
});

// route pages to requests
const static = path.join(__dirname, '../static');
app.use(express.static(static, {extensions:['html']}));
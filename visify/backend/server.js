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
            const salt = bcrypt.hash(rQ.password, 10); //using the bycrypt function to encrypt the password, the 10 means how many times the salt will run through
             db('users').insert({email: req.body.email, salt: hash});
            var addUserQuery = "INSERT INTO users VALUES ('" + (maxId) + "', '" + rQ.firstName + " " + rQ.lastName + "','" + rQ.email + "','" + rQ.password + "');"
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
        //var getUserInfo = 'select id from users where id = \'' + email + '\' \'' + password + '\';';

        // Ensure the input fields exists and are not empty
        if (email && password) {
            db.any(`SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`)
                .then(function(rows)
                {
                const user =  db('users').first('*').where({email: email});
                const validPass =  bcrypt.compare(req.body.password, user.hash);
                    console.log(rows);
                    if(rows.length == 1 || validPass)
                    {
                        res.status(200).json('Valid Email and Password!');
                        req.session.loggedin = true;
                        req.session.email = email;
                        // Redirect to home page
                        res.redirect('/');
                    }
                    else
                    {
                        res.status(400).json('Wrong password!');
                        res.send("<a href = \"/login\">Account with email and password requested not found</a>");
                    }
                })
        }
    }
});

app.get('/logout', (req, res) =>{
    req.session.destroy(()=>{
        req.logout();
        res.redirect('/');
    })
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
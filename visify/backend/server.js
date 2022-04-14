const express = require('express');
const fs = require('fs');
const pg = require('pg-promise')();
const app = express();
const port = 3000;
const path = require('path');
var bodyParser = require('body-parser');
const { info } = require('console');

app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
    var email = req.body.email;
    var password = req.body.password;
    //var getUserInfo = 'select id from users where id = \'' + email + '\' \'' + password + '\';';

	// Ensure the input fields exists and are not empty
    db.task('get-everything', task =>{
        return task.batch([
            task.any(email),
            task.any(password)
        ])

    })
    .then(info => {
        if (email && password) {
            dbConfig.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(err, results, fields) {
                // If there is an issue with the query, output the error
                if (err) throw err;
                // If the account exists
                if (results.length > 0) {
                    // Authenticate the user
                    req.session.loggedin = true;
                    req.session.email = email;
                    // Redirect to home page
                    res.sendFile(path.join(__dirname + '/../static/index.html'));
                } else {
                    res.send('Incorrect Email or Password or Both!');
                }			
                res.end();
            });
        } else {
            res.send('Please enter Email and Password!');
            res.end();
        }
    })

    .catch(err =>{
        console.log('error', err);
    })
});

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
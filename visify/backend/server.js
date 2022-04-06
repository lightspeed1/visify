const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

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
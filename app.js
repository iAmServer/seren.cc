require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT;

app.listen(port, (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is listening on port ${port}`);
    }
});
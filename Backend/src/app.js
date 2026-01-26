// create server
const express = require('express');


const app = express();


app.get("/", (req, res) => {
    res.setEncoding("Hello World");
})

module.exports = app;
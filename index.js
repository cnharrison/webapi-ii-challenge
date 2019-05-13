const express = require("express");
const server = express();
server.use(express.json());

const db = require("./data/db.js");

server.listen(9090, () => { 
    console.log("we out here listening")
}) 
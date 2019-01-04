const express = require('express');
const body_parser = require('body-parser');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const bookmarkhub_api = require("../api");

const app = express();
const port = 3000 || process.env.PORT;

function server_init(public_dir = "") {
    app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .use("/page", bookmarkhub_api.page)
    // .get("/signup")
    // .get("/login")
    .post("/bookmarks", bookmarkhub_api.bookmark)
    .use("*", function(req, res, next) {
        res.status(404).json({error: "DOGS"});
    })
    .listen(port);
}

module.exports = {
    server_init
}
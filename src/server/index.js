const express = require('express');
const body_parser = require('body-parser');
const sqlite3 = require('sqlite3');
const cors = require('cors');
const bookmarkhub_api = require("../api");

const app = express();

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

module.exports = app;
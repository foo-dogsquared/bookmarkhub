const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const cookie_parser = require("cookie-parser");
const nanoid_generate = require("nanoid/generate");
const dotenv = require("dotenv").config();
const logger = require("morgan");
const nanoid_url_friendly_alphabet = require("nanoid/url");
const bookmarkhub_router = require("./router");
const path = require("path");
const app_constants = require("./app_constants");
const session_store = require("./session_store");

const app = express();

console.log(app_constants.mongodb_db_url);

app
    .use(helmet())
    .use(cors())
    .use(express.json())
    .set("views", path.join(__dirname, "views"))
    .set("view engine", "pug")
    .use(logger("dev"))
    .use(express.static(path.join(__dirname, "../public")))
    .use(express.urlencoded({extended: true}))
    .use(cookie_parser())
    .use(session({
        cookie: {
            secure: true,
            maxAge: app_constants.cookies.MAX_AGE
        },
        genid: function(req) {return "_" + nanoid_generate(nanoid_url_friendly_alphabet, 19)},
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        resave: false,
        store: session_store,
    }))
    .use(app_constants.app_configuration.home, bookmarkhub_router.home)
    .use(app_constants.app_configuration.page, bookmarkhub_router.page)
    .use(app_constants.app_configuration.account, bookmarkhub_router.account)
    .use(app_constants.app_configuration.bookmarks_page, bookmarkhub_router.bookmark)

module.exports = app;

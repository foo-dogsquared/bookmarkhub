const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const MongoDBStore = require("connect-mongodb-session")(session);
const cookie_parser = require("cookie-parser");
const nanoid_generate = require("nanoid/generate");
const dotenv = require("dotenv").config();
const logger = require("morgan");
const nanoid_url_friendly_alphabet = require("nanoid/url");
const bookmarkhub_router = require("./router");
const path = require("path");
const APP_CONSTANTS = require("./app_constants");

const app = express();

console.log(APP_CONSTANTS.mongodb_db_url);

const session_store = new MongoDBStore({
    uri: APP_CONSTANTS.mongodb_db_url,
    collection: "sessions"
}, function(error) {if (error) return error;});

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
        cookie: {secure: true},
        genid: function(req) {return "_" + nanoid_generate(nanoid_url_friendly_alphabet, 19)},
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        resave: false,
        store: session_store
    }))
    .use(APP_CONSTANTS.home, bookmarkhub_router.home)
    .use(APP_CONSTANTS.page, bookmarkhub_router.page)
    .use(APP_CONSTANTS.account, bookmarkhub_router.account)
    .use(APP_CONSTANTS.bookmarks_page, bookmarkhub_router.bookmark)

module.exports = app;

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
const APP_CONSTANTS = require("./constant_routes");


const mongodb_url = process.env.MONGODB_URL || "mongodb://127.0.0.1/test"

const app = express();
const session_store = new MongoDBStore({
    uri: mongodb_url,
    collection: "sessions"
}, function(error) {if (error) throw new Error;});

const app_configurations = {
    app_name: APP_CONSTANTS.APP_NAME, 
    app_repo_link: APP_CONSTANTS.APP_REPO_LINK, 
    app_description: APP_CONSTANTS.APP_DESCRIPTION,
    login_page: APP_CONSTANTS.LOGIN_PAGE,
    signup_page: APP_CONSTANTS.SIGNUP_PAGE,
    about_page: APP_CONSTANTS.ABOUT,
    help_page: APP_CONSTANTS.HELP
};

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
    .use("*", function(req, res, next) {
        res.appSettings = app_configurations;
        next();
    })
    .use(APP_CONSTANTS.HOME, bookmarkhub_router.home)
    .use(APP_CONSTANTS.PAGE, bookmarkhub_router.page)
    .use(APP_CONSTANTS.ACCOUNT, bookmarkhub_router.account)
    .use(APP_CONSTANTS.BOOKMARKS, bookmarkhub_router.bookmark)

module.exports = app;

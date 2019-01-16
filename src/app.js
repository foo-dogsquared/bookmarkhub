const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const node_sass_middleware = require("node-sass-middleware");
const MongoDBStore = require("connect-mongodb-session")(session);
const nanoid_generate = require("nanoid/generate");
const dotenv = require("dotenv").config();
const logger = require("morgan");
const nanoid_url_friendly_alphabet = require("nanoid/url");
const bookmarkhub_api = require("./api");
const path = require("path");

const app = express();
const session_store = new MongoDBStore({
    uri: process.env.MONGODB_URL,
    databaseName: "",
    collection: "sessions"
});

const app_configurations = {
    app_name: "bookmarkhub", 
    app_repo_link: "https://github.com/foo-dogsquared/bookmarkhub", 
    app_description: "A bookmark sharing hub for something."
};

app
    .use(helmet())
    .use(cors())
    .use(express.json())
    .set("views", path.join(__dirname, "src/views"))
    .set("view engine", "pug")
    .use(node_sass_middleware({
        src: path.join(__dirname, "src/style"),
        dest: path.join(__dirname, "public/css"),
        indentedSyntax: false,
        debug: true,
    }))
    .use(logger("dev"))
    .use(express.static(path.join(__dirname, "public")))
    .use(express.urlencoded({extended: true}))
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
    .use("/", bookmarkhub_api.home)
    .use("/page", bookmarkhub_api.page)
    .use("/account", bookmarkhub_api.account)
    .use("/bookmarks", bookmarkhub_api.bookmark)

module.exports = app;

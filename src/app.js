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
        genid: function(req) {return "_" + nanoid_generate(nanoid_url_friendly_alphabet, 45)},
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        resave: true,
        store: session_store,
    }))
    .use("*", function(req, res, next) {
        if (req.cookies[app_constants.cookies.ERROR]) res.clearCookie(app_constants.cookies.ERROR);
        res.cookie(app_constants.cookies.SESSION_ID, req.sessionID);
        if (req.cookies[app_constants.cookies.USER_SESSION_ID]) res[app_constants.cookies.USER_SESSION_ID_COPY] = req.cookies[app_constants.cookies.USER_SESSION_ID];
        next();
    })
    .use(app_constants.app_configuration.home, bookmarkhub_router.home)
    .use(app_constants.app_configuration.page, bookmarkhub_router.page)
    .use(app_constants.app_configuration.account, bookmarkhub_router.account)
    .use(app_constants.app_configuration.bookmarks_page, bookmarkhub_router.bookmark)
    .use("*", function(req, res, next) {
        console.log(res[app_constants.cookies.USER_SESSION_ID_COPY]);
        if (res[app_constants.cookies.USER_SESSION_ID_COPY] && (res[app_constants.cookies.USER_SESSION_ID_COPY] !== req.cookies[app_constants.cookies.USER_SESSION_ID] || !req.cookies[app_constants.cookies.USER_SESSION_ID])) {
            console.log("Is it here?");
            session_store.destroy(res[app_constants.cookies.USER_SESSION_ID_COPY], function(error) {
                if (error) {
                    console.log("It fails.");
                    res.cookie(app_constants.cookies.ERROR, error)
                    res.redirect(app_constants.app_configuration.home);
                }
            })
        }
        next();
    })
    .use("*", function(req, res, next) {
        if (req.statusCode === 404) res.render("error", res);
    })
    
module.exports = app;

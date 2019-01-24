const express = require('express');
const session = require('express-session');
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

app
    .use(helmet())
    .set("views", path.join(__dirname, "views"))
    .set("view engine", "pug")
    .use(logger("dev"))
    .use(express.static(path.join(__dirname, "../public")))
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .use(cookie_parser())
    .use(session({
        cookie: {
            secure: true,
            maxAge: app_constants.cookies.MAX_AGE
        },
        genid: function(req) {return "_" + nanoid_generate(nanoid_url_friendly_alphabet, 64)},
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        resave: true,
        store: session_store,
    }))
    .use(function(req, res, next) {
        if (req.cookies[app_constants.cookies.ERROR]) res.clearCookie(app_constants.cookies.ERROR);
        if (req.cookies[app_constants.cookies.SUCCESS]) res.clearCookie(app_constants.cookies.SUCCESS);
        res.cookie(app_constants.cookies.SESSION_ID, req.sessionID);
        if (req.cookies[app_constants.cookies.USER_SESSION_ID]) res[app_constants.cookies.USER_SESSION_ID_COPY] = req.cookies[app_constants.cookies.USER_SESSION_ID];
        next();
    })
    .use(app_constants.app_configuration.home, bookmarkhub_router.home)
    .use(app_constants.app_configuration.account, bookmarkhub_router.account)
    .use(app_constants.app_configuration.user, bookmarkhub_router.user)
    .use("*", function(req, res) {
        if (!res.statusCode || Math.floor(res.statusCode / 100) === 2) res.status(404);
        res.render("error", {
            title: res.statusCode,
            app_configuration: app_constants.app_configuration, 
            res,
            cookies: req.cookies,
            cookies_constant: app_constants.cookies
        });
    })
    .use("*", function(error, req, res, next) {
        console.error(error.stack);
        res.status(500).render("error", {
            title: res.statusCode,
            app_configuration: app_constants.app_configuration,
            res,
            cookies: req.cookies,
            cookies_constant: app_constants.cookies
        })
    })

module.exports = app;

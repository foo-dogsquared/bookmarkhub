const mongoose = require("mongoose");
const account_router = require("express").Router();
const email_validator = require("email-validator");
const {app_configuration} = require("../app_constants");
const app_constants = require("../app_constants");
const controller = require("../controllers/index");
const cryptokeys = require("../cryptokeys");

account_router.get(app_configuration.profile, function(req, res, next) {
    controller.accounts.check_for_session(req)
    .then(function(session) {
        controller.accounts.retrieve_user(req, res, session.username)
        .then(function(user_object) {
            res.render("accounts/owner", {
                title: session.username,
                app_configuration,
                cookies: req.cookies,
                cookies_constant: app_constants.cookies,
                session,
                user_object
            })
        })
        .catch(function() {
            res.status(409);
            next();
        })
    })
    .catch(function() {
        res.status(401);
        next();
    })
})

account_router.get(app_configuration.own_bookmarks, function(req, res, next) {
    controller.accounts.check_for_session(req)
    .then(function(session) {
        controller.accounts.retrieve_user(req, res, session.username)
        .then(function(user_object) {
            res.render("accounts/owner", {
                title: session.username,
                app_configuration,
                cookies: req.cookies,
                cookies_constant: app_constants.cookies,
                session
            })
        })
        .catch(function() {
            res.status(401);
            next();
        })
    })
    .catch(function() {
        res.status(401);
        next();
    })
});

account_router.post(app_configuration.edit_description, function(req, res, next) {
    controller.accounts.edit_description(req, res, JSON.stringify(req.body.description))
    .then(function() {
        res.redirect(app_configuration.profile_page);
    })
    .catch(function(error) {
        res.cookie(app_constants.cookies.ERROR, error.extra);
        res.redirect(app_configuration.profile_page);
    })
})

module.exports = account_router;

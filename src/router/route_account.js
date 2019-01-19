const mongoose = require("mongoose");
const account_router = require("express").Router();
const email_validator = require("email-validator");
const {app_configuration} = require("../app_constants");
const app_constants = require("../app_constants");
const session_store = require("../session_store");
const controller = require("../controllers/index");

account_router.get(app_configuration.login, function(req, res) {
    if (req.session.is_user_logged) res.redirect(bookmarks_page);
    else {
        res.render("users/login", {
            title: "Login",
            app_configuration
        })
    }
});

account_router.post(app_configuration.login, function(req, res) {
    controller.users.login_user(req, res, req.body.username, req.body.password)
    .then()
    .catch(function(error) {
        console.log("IT fials");
    })
})

account_router.get(app_configuration.signup, function(req, res) {
    const error_message = (req.cookies.error) ? JSON.parse(req.cookies.error) : undefined;
    if (req.cookies.error) res.clearCookie(app_constants.cookies.ERROR);
    res.render("users/signup", {
        title: "Sign Up",
        app_configuration,
        error: error_message
    });
});

account_router.post(app_configuration.signup, function(req, res) {
    controller.users.register_user(req, res, req.body.username, req.body.email_address, req.body.password)
    .then(function() {
        req.session[app_constants.cookies.USER_LOGGED_IN] = true;
        res.cookie(app_constants.cookies.USER_LOGGED_IN, true);
        res.cookie(app_constants.cookies.SESSION_ID, req.sessionID)
        res.redirect(app_configuration.home);
    })
    .catch(function(error) {
        console.log(error);
        const error_messages = {};
        if (error) {
            for (const field in error.extra.errors) {error_messages[field] = error.extra.errors[field].message;}
            res.cookie(app_constants.cookies.ERROR, JSON.stringify(error_messages));
        }
        
        res.redirect(app_configuration.signup_page);
    });
});

account_router.get(app_configuration.logout, function(req, res) {
    res.status(307).redirect()
})

module.exports = account_router;

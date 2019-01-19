const {app_name, app_repo_link, app_description, login_page, signup_page, bookmarks_page, about_page, help_page} = require("../app_constants");
const mongoose = require("mongoose");
const account_router = require("express").Router();
const controller = require("../controllers/index");
const email_validator = require("email-validator");

account_router.get("/login", function(req, res) {
    if (req.session.is_user_logged) res.redirect(bookmarks_page);
    else {
        res.render("users/login", {
            title: "Login",
            app_name, app_repo_link, app_description, login_page, signup_page, about_page, help_page
        })
    }
});

account_router.post("/login", function(req, res) {
    console.log(req.body);
    res.send("HELLO!")
})

account_router.get("/signup", function(req, res) {
    res.render("users/signup", {
        title: "Sign Up",
        app_name, app_repo_link, app_description, login_page, signup_page, about_page, help_page
    });
})

account_router.post("/signup", function(req, res) {
    console.log(req.body, Boolean(req.body.username) === true, req.body.password.length >= 8, email_validator.validate(req.body.email_address));
    if (Boolean(req.body.username) && (req.body.password.length >= 8) && email_validator.validate(req.body.email_address)) {
        controller.users.register_user(req, res, req.body.username, req.body.email_address, req.body.password);
    }
})

module.exports = account_router;

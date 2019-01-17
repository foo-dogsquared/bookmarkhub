const APP_CONSTANTS = require("../constant_routes");
const mongoose = require("mongoose");
const account_router = require("express").Router();

account_router.get("/login", function(req, res) {
    const {app_name, app_repo_link, app_description, login_page, signup_page, about_page, help_page} = res.appSettings;
    if (req.session.is_user_logged) res.redirect(APP_CONSTANTS.BOOKMARKS);
    else {
        res.render("users/login", {
            login_validation_route: "/login",
            app_name, app_repo_link, app_description, login_page, signup_page, about_page, help_page
        })
    }
});

account_router.post("/login", function(req, res) {
    console.log(req.body);
    res.send("HELLO!")
})

account_router.get("/signup", function(req, res) {
    const {app_name, app_repo_link, app_description, login_page, signup_page, about_page, help_page} = res.appSettings;
    res.render("users/signup", {
        signup_validation_api: "/signup/validate",
        app_name, app_repo_link, app_description, login_page, signup_page, about_page, help_page
    });
})

account_router.post("/signup", function(req, res) {
    res.send("HI!")
})

module.exports = account_router;

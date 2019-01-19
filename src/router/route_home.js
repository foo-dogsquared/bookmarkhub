const express = require("express");
const {app_name, app_description, app_repo_link, home, login_page, signup_page, about_page, help_page} = require("../app_constants");

const home_router = express.Router();
;

home_router.get("/", function(req, res) {
        res.render("layout/home", {
        title: `${app_name} | ${app_description}`, 
        replace_title: true,
        app_name, app_description, app_repo_link, login_page, signup_page, about_page, help_page
    });
});

home_router.get("/help", function(req, res) {
    res.render("layout/help", {
        title: `Help`,
        app_name, app_description, app_repo_link, login_page, signup_page, about_page, help_page
    })
})

home_router.get("/about", function(req, res) {
    res.render("layout/about", {
        title: `About`,
        app_name, app_description, app_repo_link, login_page, signup_page, about_page, help_page
    })
})

module.exports = home_router;

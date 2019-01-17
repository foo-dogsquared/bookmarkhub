const express = require("express");

const home_router = express.Router();

home_router.get("/", function(req, res) {
    const app_settings = res.appSettings;
    res.render("layout/home", {
        title: `${app_settings.app_name} | ${app_settings.app_description}`, 
        content: "Hello world!", 
        app_name: app_settings.app_name, 
        app_repo_link: app_settings.app_repo_link,
        login_page: "/account/login",
        signup_page: "/account/signup",
        about_page: "/about",
        help_page: "/help"
    });
})


module.exports = home_router;

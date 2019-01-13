const express = require("express");

const home_router = express.Router();

home_router.get("/", function(req, res) {
    const app_settings = res.appSettings;
    res.render("layout/home", {
        title: `${app_settings.app_name} | ${app_settings.app_description}`, 
        content: "OK. WHATEVER!", 
        app_name: app_settings.app_name, 
        open_sourced: app_settings.open_sourced,
        app_repo_link: app_settings.app_repo_link
    })
})


module.exports = home_router;
const express = require("express");
const {app_configuration} = require("../app_constants");
const home_router = express.Router();

home_router.get(app_configuration.home, function(req, res) {
        res.render("layout/home", {
        title: `${app_configuration.app_name} | ${app_configuration.app_description}`, 
        replace_title: true,
        app_configuration,
        user_logged_in: req.cookies.user_logged_in
    });
});

home_router.get(app_configuration.help_page, function(req, res) {
    res.render("layout/help", {
        title: `Help`,
        app_configuration,
        user_logged_in: req.session.user_logged_in
    })
})

home_router.get(app_configuration.about_page, function(req, res) {
    res.render("layout/about", {
        title: `About`,
        app_configuration,
        user_logged_in: req.session.user_logged_in
    })
})

module.exports = home_router;

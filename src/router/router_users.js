const user_router = require("express").Router();
const app_constants = require("../app_constants");
const {app_configuration} = require("../app_constants");
const controller = require("../controllers");

user_router.get("/:username", function(req, res, next) {
    controller.accounts.retrieve_user(req, res, req.params.username)
    .then(function(user_object) {
        res.render("accounts/account", {
            title: req.params.username,
            app_configuration,
            user_object,
            cookies: req.cookies,
            cookies_constant: app_constants.cookies,
            cookie_name_constants: app_constants.cookies
        });
    })
    .catch(function(error) {
        next();
    })
});

module.exports = user_router;

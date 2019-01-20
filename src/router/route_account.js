const mongoose = require("mongoose");
const account_router = require("express").Router();
const email_validator = require("email-validator");
const {app_configuration} = require("../app_constants");
const app_constants = require("../app_constants");
const controller = require("../controllers/index");

account_router.get("/:username", function(req, res) {
    if (req.params.username.match(/[^A-Za-z0-9_-]+/gi)) res.redirect(app_configuration.home);
})

module.exports = account_router;

const mongoose = require("mongoose");
const user_schema = require("../models/user");
const email_validator = require("email-validator");
const {password_minimum_length, mongodb_db_url, home} = require("../app_constants");

function register_user(req, res, username, email_address, password) {
    let error_message = "";

    if (!email_validator.validate(email_address)) {error_message += "Email address is invalid.\n"}
    if (username.match(/[^A-Za-z0-9_-]+/)) {error_message += "Username can only contain alphanumeric characters.\n"}
    if (password.length < password_minimum_length) {error_message += "Minimum password length is 8 characters.\n";}
    
    if (error_message) return {success: false, error: error_message}
    
    mongoose.connect(mongodb_db_url, {useNewUrlParser: true});
    
    const db = mongoose.connection;
    db.on("error", console.error.bind("Connection error."));
    db.once("open", function() {
        const User = mongoose.model("User", user_schema);

        const new_user = new User({username, email_address, password});
        new_user.save(function(error) {
            if (error) res.send(error);
        });

    });
}

async function login_user(req, res) {

}

async function logout_user() {

}

async function reset_password(username, email_address, callback) {

}

async function reset_password_confirm(new_password, username, email_address, callback) {

}

module.exports = {
    register_user,
    login_user,
    logout_user,
    reset_password,
    reset_password_confirm
}

const mongoose = require("mongoose");
const user_schema = require("../models/user");
const User = mongoose.model("User");

async function register_user(req, res, username, email_address, password) {
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

const mongoose = require("mongoose");
const user_schema = require("../models/user");
const email_validator = require("email-validator");
const {mongodb_db_url, mongodb_user_collection} = require("../app_constants");
const app_constants = require("../app_constants");
const api_response = require("../models/api_response");

function register_user(req, res, username, email_address, password) {
    mongoose.connect(mongodb_db_url, {useNewUrlParser: true});
    
    return new Promise(function(resolve, reject) {
        const db = mongoose.connection;
        db.on("error", function() {
            console.error.bind("Connection error.")
            reject(new api_response(false, api_response.prototype.DB_ERROR));
        });
        db.once("open", function() {
            const User = mongoose.model(mongodb_user_collection, user_schema);
    
            const new_user = new User({username, email_address, password});
            new_user.save(function(error) {
                console.log(error);
                if (!error || error === null) resolve(new api_response(true));
                else reject(new api_response(false, error));
            });
        });
    })
}

function login_user(req, res, username, password) {
    mongoose.connect(mongodb_db_url, {useNewUrlParser: true});

    return new Promise(function(resolve, reject) {
        const User = mongoose.model(mongodb_user_collection, user_schema);

        const db = mongoose.connection;

        db.on("error", function() {
            console.error.bind("Connection error");
            reject(new api_response(false, api_response.prototype.DB_ERROR));
        });
        db.once("open", function() {
            User.findOne({username: username}, function(error, result) {
                if (error) reject(new api_response(false, api_response.prototype.DB_ERROR));
                if (result.length <= 0) reject(new api_response(false, app_constants.login_error.INVALID_USERNAME_LOGIN_ERROR_MSG));
                else {
                    console.log(User.hash_password(password, result.salt));
                    if (User.hash_password(password, result.salt) === result.hash_password) resolve(new api_response(true));
                    else reject(new api_response(false, app_constants.login_error.INVALID_PASSWORD_LOGIN_ERROR_MSG));
                }
            });
        });
    })
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

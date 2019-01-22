const mongoose = require("mongoose");
const user_schema = require("../models/user");
const email_validator = require("email-validator");
const {mongodb_db_url, mongodb_user_collection} = require("../app_constants");
const app_constants = require("../app_constants");
const api_response = require("../models/api_response");
const session_store = require("../session_store");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

function send_verification_mail(req, res, username, email_address) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SUPPORT_EMAIL,
            pass: process.env.SUPPORT_EMAIL_PASSWORD
        }
    })

    const mail_options = {
        from: process.env.SUPPORT_EMAIL,
        to: "foo.dogsquared@gmail.com",
        subject: "TESTING",
        html: "<p>HELLLLOOOOO WoOOOORLDLDLDL!</p>"
    }

    transporter.sendMail(mail_options, function(error, info) {
        if (error) console.log(error);
        else console.log(info);
    })
}

function register_user(req, res, username, email_address, password, confirm_password) {
    mongoose.connect(mongodb_db_url, {useNewUrlParser: true});
    
    return new Promise(function(resolve, reject) {
        const db = mongoose.connection;
        db.on("error", function() {
            console.error.bind("Connection error.")
            return reject(new api_response(false, {errors: {database: {message: api_response.prototype.DB_ERROR}}}));
        });
        db.once("open", function() {
            const User = mongoose.model(mongodb_user_collection, user_schema);
    
            const new_user = new User({username, email_address, password, confirm_password});
            new_user.save(function(error) {
                if (!error || error === null) return resolve(new api_response(true));
                else return reject(new api_response(false, error));
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
            return reject(new api_response(false, api_response.prototype.DB_ERROR));
        });
        db.once("open", function() {
            User.findOne({username: username}, function(error, result) {
                if (error) return reject(new api_response(false, api_response.prototype.DB_ERROR));
                if (!result) return reject(new api_response(false, app_constants.login_error.INVALID_USERNAME_LOGIN_ERROR_MSG));
                else {
                    if (User.hash_password(password, result.salt) === result.hashed_password) {
                        if (result.confirmed) return resolve(new api_response(true));
                        else return reject(new api_response(false, app_constants.login_error.ACCOUNT_NOT_CONFIRMED_LOGIN_ERROR_MSG))
                    }
                    else return reject(new api_response(false, app_constants.login_error.INVALID_PASSWORD_LOGIN_ERROR_MSG));
                }
            });
        });
    });
}

function logout_user(req, res) {
    return new Promise(function(resolve, reject) {
        if (!req.cookies[app_constants.cookies.USER_SESSION_ID]) return reject(new api_response(false, app_constants.logout_error.INVALID_USER_STATE_LOGOUT_ERROR_MESSAGE));

        session_store.get(req.cookies[app_constants.cookies.USER_SESSION_ID], function(error, session) {
            if (error) return reject(new api_response(false, app_constants.logout_error.LOGOUT_ERROR_MESSAGE))
            if (!session) return reject(new api_response(false, app_constants.logout_error.LOGOUT_ERROR_MESSAGE))
            else {
                session_store.destroy(req.cookies[app_constants.cookies.USER_SESSION_ID], function(error) {
                    if (error) return reject(new api_response(false, app_constants.logout_error.LOGOUT_ERROR_MESSAGE))
                    else return resolve(new api_response(true));
                });
            }
        });
    })
}

function reset_password(email_address) {
    mongoose.connect(app_constants.mongodb_db_url, {useNewUrlParser: true})

    return new Promise(function(resolve, reject) {
        const db = mongoose.connection;
        const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);
        
        db.on("error", function() {
            console.error(app_constants.MONGODB_ERROR_CONNECTION_MSG);
            return reject(new api_response(false, app_constants.reset_password_error.INVALID_EMAIL_ADDRESS_RESET_PASSWORD_ERROR_MSG));
        });
        db.once("open", function() {

            User.findOne({email_address: email_address}, function(error, result) {
                if (error) return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG));

                if (!result) return reject(new api_response(false, app_constants.reset_password_error.NO_EMAIL_ADDRESS_FOUND_RESET_PASSWORD_ERROR_MSG));
                else return resolve(new api_response(true));
            });
        })
    })
}

function reset_password_confirm(new_password, username, email_address, callback) {

}

module.exports = {
    register_user,
    login_user,
    logout_user,
    reset_password,
    reset_password_confirm,
    send_verification_mail
}

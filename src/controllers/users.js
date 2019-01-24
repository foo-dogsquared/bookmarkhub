const mongoose = require("mongoose");
const user_schema = require("../models/user");
const email_validator = require("email-validator");
const {mongodb_db_url, mongodb_user_collection} = require("../app_constants");
const app_constants = require("../app_constants");
const api_response = require("../models/api_response");
const session_store = require("../session_store");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

function send_verification_mail(req, res, username, email_address) {
    return new Promise(function(resolve, reject) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SUPPORT_EMAIL,
                pass: process.env.SUPPORT_EMAIL_PASSWORD
            }
        })
        jwt.sign({username, email_address}, process.env.VERIFICATION_TOKEN_SECRET, {algorithm: "HS512", expiresIn: "4d"}, function(error, encoded_string) {
            if (error) return reject(new api_response(false, app_constants.signup_error.UNKNOWN_VALIDATION_ERROR_MSG));
            if (encoded_string) {
                const encoded_url = `${app_constants.app_configuration.app_link}${app_constants.app_configuration.account_confirmation}/${encoded_string}`;
                const mail_options = {
                    from: process.env.SUPPORT_EMAIL,
                    to: email_address,
                    subject: app_constants.nodemailer_settings.verification_initialization_email_subject,
                    html: `${app_constants.nodemailer_settings.verification_initialization_email_html} 
                            <a href=${encoded_url}>${encoded_url}</a>
                            <hr>
                            <p>Created by ${app_constants.nodemailer_settings.created_by(app_constants.app_configuration.author, app_constants.app_configuration.author_link)}</p>`
                }

                transporter.sendMail(mail_options, function(error, info) {
                    if (error) return reject(new api_response(false, app_constants.signup_error.UNKNOWN_MAIL_SENDING_ERROR_MSG));
                    else return resolve();
                })
            }
        })
    })
}

function verify_account(req, res, web_token) {
    mongoose.connect(app_constants.mongodb_db_url, {useNewUrlParser: true});

    return new Promise(function(resolve, reject) {
        jwt.verify(web_token, process.env.VERIFICATION_TOKEN_SECRET, function(error, decoded_string) {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    const db = mongoose.connection;
                    db.on("error", function() {return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG))});
                    db.once("open", function() {
                        const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);

                        User.findOne({username: decoded_string.username}, function(error, result) {
                            if (error) return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG));
                            if (!result) return reject(new api_response(false, app_constants.general_error.USER_CANNOT_BE_FOUND));
                            else {
                                if (!result.confirmed) {
                                    User.deleteOne({username: decoded_string.username}, function(error, result) {
                                        if (error) return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG));
                                        if (!result) return reject(new api_response(false, app_constants.general_error.USER_CANNOT_BE_FOUND));
                                        else return reject(new api_response(false, app_constants.signup_error.EXPIRED_TOKEN_SIGNUP_ERROR_MSG));
                                    })
                                }
                                else return resolve(new api_response(true));
                            }
                        })
                        
                        return reject(new api_response(false, app_constants.signup_error.EXPIRED_TOKEN_SIGNUP_ERROR_MSG));
                    })
                }
                else if (error.name === "JsonWebTokenError") {return reject(new api_response(false, app_constants.signup_error.MALFORMED_TOKEN_SIGNUP_ERROR_MSG));}
                else if (error.name === "NotBeforeError") {return reject(new api_response(false, app_constants.signup_error.NOT_BEFORE_ERROR_TOKEN_SIGNUP_ERROR_MSG));}
            }
            else if (!error && decoded_string.username && decoded_string.email_address) {                    
                const db = mongoose.connection;
                db.on("error", function() {return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG))});
                db.once("open", function() {
                    const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);

                    User.findOneAndUpdate({username: decoded_string.username}, {confirmed: true}, function(error, doc, result) {
                        if (error) return reject(new api_response(false, app_constants.signup_error.UNKNOWN_VALIDATION_ERROR_MSG));
                        if (!doc) return reject(new api_response(false, app_constants.general_error.USER_CANNOT_BE_FOUND));
                        else {
                            // TODO: Send an email being the account verification is successful!
                            const transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: process.env.SUPPORT_EMAIL,
                                    pass: process.env.SUPPORT_EMAIL_PASSWORD
                                }
                            });
                            const mail_options = {
                                from: process.env.SUPPORT_EMAIL,
                                to: doc.email_address,
                                subject: app_constants.nodemailer_settings.verification_success_email_subject,
                                html: `${app_constants.nodemailer_settings.verification_success_email_html}
                                        <hr>
                                        <p> Created by ${app_constants.nodemailer_settings.created_by(app_constants.app_configuration.author, app_constants.app_configuration.author_link)}</p>`
                            }

                            transporter.sendMail(mail_options, function(error, info) {
                                if (error) return reject(new api_response(false, app_constants.signup_error.UNKNOWN_MAIL_SENDING_ERROR_MSG));
                                else return resolve(web_token);
                            })
                        }
                    })
                })
            }
            else return reject(new api_response(false, app_constants.signup_error.UNKNOWN_VALIDATION_ERROR_MSG));
        })
    })
}

function register_user(req, res, username, email_address, password, confirm_password) {
    mongoose.connect(mongodb_db_url, {useNewUrlParser: true});
    
    return new Promise(function(resolve, reject) {
        const db = mongoose.connection;
        db.on("error", function() {
            console.error("Connection error.")
            return reject(new api_response(false, {errors: {database: {message: api_response.prototype.DB_ERROR}}}));
        });
        db.once("open", function() {
            const User = mongoose.model(mongodb_user_collection, user_schema);
    
            const new_user = new User({username, email_address, password, confirm_password});
            new_user.save(function(error) {
                if (!error || error === null) {
                    send_verification_mail(req, res, username, email_address)
                    .then(function() {return resolve(new api_response(true));})
                    .catch(function() {
                        User.findByIdAndDelete({username: username}, function(error, res) {
                            if (error) return reject(new api_response(false, {errors: {mailer: {message: app_constants.signup_error.UNKNOWN_SIGNUP_ERROR}}}));
                            else return reject(new api_response(false, {errors: {mailer: {message: app_constants.signup_error.UNKNOWN_MAIL_SENDING_ERROR_MSG}}}));
                        })
                        return reject(new api_response(false, {errors: {mailer: {message: app_constants.signup_error.UNKNOWN_MAIL_SENDING_ERROR_MSG}}}))
                    });
                }
                else return reject(new api_response(false, error));
            });
        });
    })
}

function login_user(req, res, username, password) {
    mongoose.connect(mongodb_db_url, {useNewUrlParser: true});

    return new Promise(function(resolve, reject) {
        if (username.length <= 0) return reject(new api_response(false, app_constants.login_error.BLANK_USERNAME_LOGIN_ERROR_MSG));
        if (password.length <= 0) return reject(new api_response(false, app_constants.login_error.BLANK_PASSWORD_LOGIN_ERROR_MSG));

        const User = mongoose.model(mongodb_user_collection, user_schema);

        const db = mongoose.connection;

        db.on("error", function() {
            console.error("Connection error");
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

function reset_password(req, res, email_address) {
    mongoose.connect(app_constants.mongodb_db_url, {useNewUrlParser: true})

    return new Promise(function(resolve, reject) {
        if (email_address.length <= 0) return reject(new api_response(false, app_constants.reset_password_error.BLANK_EMAIL_ADDRESS_RESET_PASSWORD_ERROR_MSG));
        else if (!email_validator.validate(email_address)) return reject(new api_response(false, app_constants.reset_password_error.INVALID_EMAIL_ADDRESS_RESET_PASSWORD_ERROR_MSG));
        const db = mongoose.connection;
        const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);
        
        db.on("error", function() {
            console.error(app_constants.MONGODB_ERROR_CONNECTION_MSG);
            return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG));
        });
        db.once("open", function() {

            User.findOne({email_address: email_address}, function(error, result) {
                if (error) return reject(new api_response(false, app_constants.reset_password_error.INVALID_EMAIL_ADDRESS_RESET_PASSWORD_ERROR_MSG));

                if (!result) return reject(new api_response(false, app_constants.reset_password_error.NO_EMAIL_ADDRESS_FOUND_RESET_PASSWORD_ERROR_MSG));
                else {
                    // send an email with the token
                    send_password_reset_mail(req, res, result.username, result.email_address)
                    .then(function() {
                        return resolve(new api_response(true));
                    })
                    .catch(function() {
                        return reject(new api_response(false, app_constants.reset_password_error.SENDING_PASSWORD_RESET_EMAIL_FAIL_ERROR_MSG));
                    })
                }
            });
        })
    })
}

function send_password_reset_mail(req, res, username, email_address) {
    return new Promise(function(resolve, reject) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SUPPORT_EMAIL,
                pass: process.env.SUPPORT_EMAIL_PASSWORD
            }
        })
        jwt.sign({username, email_address}, process.env.PASSWORD_RESET_TOKEN_SECRET, {algorithm: "HS512", expiresIn: "1h"}, function(error, encoded_string) {
            if (error) return reject(new api_response(false, app_constants.signup_error.UNKNOWN_VALIDATION_ERROR_MSG));
            if (encoded_string) {
                const encoded_url = `${app_constants.app_configuration.app_link}${app_constants.app_configuration.reset_password_confirm_page}/${encoded_string}`;
                const mail_options = {
                    from: process.env.SUPPORT_EMAIL,
                    to: email_address,
                    subject: app_constants.nodemailer_settings.password_reset_token_email_subject(app_constants.app_configuration.app_name),
                    html: `${app_constants.nodemailer_settings.password_reset_token_email_html} 
                            <a href=${encoded_url}>${encoded_url}</a>
                            <hr>
                            <p>Created by ${app_constants.nodemailer_settings.created_by(app_constants.app_configuration.author, app_constants.app_configuration.author_link)}</p>`
                }

                transporter.sendMail(mail_options, function(error, info) {
                    if (error) return reject(new api_response(false, app_constants.signup_error.UNKNOWN_MAIL_SENDING_ERROR_MSG));
                    else return resolve();
                })
            }
        })
    })
}

function verify_password_token(req, res, web_token) {
    mongoose.connect(app_constants.mongodb_db_url, {useNewUrlParser: true});

    return new Promise(function(resolve, reject) {
        jwt.verify(web_token, process.env.PASSWORD_RESET_TOKEN_SECRET, function(error, decoded_string) {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    return reject(new api_response(false, app_constants.reset_password_error.EXPIRED_PASSWORD_RESET_TOKEN_ERROR_MSG));
                }
                else if (error.name === "JsonWebTokenError") {return reject(new api_response(false, app_constants.reset_password_error.MALFORMED_PASSWORD_RESET_TOKEN_ERROR_MSG));}
                else if (error.name === "NotBeforeError") {return reject(new api_response(false, app_constants.reset_password_error.NOT_BEFORE_RESET_ERROR_TOKEN_ERROR_MSG));}
                else return reject(new api_response(false, app_constants.reset_password_error.UNKNOWN_RESET_PASSWORD_TOKEN_ERROR));
            }
            else if (!error && decoded_string.username && decoded_string.email_address) {                    
                const db = mongoose.connection;
                db.on("error", function() {return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG))});
                db.once("open", function() {
                    const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);

                    User.findOne({username: decoded_string.username}, function(error, doc, result) {
                        if (error) return reject(new api_response(false, app_constants.signup_error.UNKNOWN_VALIDATION_ERROR_MSG));
                        if (!doc) return reject(new api_response(false, app_constants.general_error.USER_CANNOT_BE_FOUND));
                        else return resolve(new api_response(true));
                    })
                })
            }
            else return reject(new api_response(false, app_constants.reset_password_error.UNKNOWN_RESET_PASSWORD_TOKEN_ERROR));            
        })
    })
}

function reset_password_confirm(req, res, web_token) {
    mongoose.connect(app_constants.mongodb_db_url, {useNewUrlParser: true});
    
    return new Promise(function(resolve, reject) {
        if (req.body.password.length <= 0) return reject(new api_response(false, app_constants.reset_password_error.BLANK_PASSWORD_RESET_ERROR_MSG))
        else if (req.body.password.length < app_constants.password_minimum_length) return reject(new api_response(false, app_constants.reset_password_error.PASSWORD_LENGTH_RESET_PASSWORD_ERROR_MSG));
        else if (req.body.password.length > app_constants.password_maximum_length) return reject(new api_response(false, app_constants.reset_password_error.MAXIMUM_PASSWORD_LENGTH_RESET_ERROR_MSG));
        else if (req.body.password !== req.body.confirm_password) return reject(new api_response(false, app_constants.reset_password_error.CONFIRM_PASSWORD_MISMATCH_RESET_ERROR_MSG));
        jwt.verify(web_token, process.env.PASSWORD_RESET_TOKEN_SECRET, function(error, decoded_string) {
            if (decoded_string.username && decoded_string.email_address) {
                const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);
                const new_password_salt = User.generate_salt(16);
                const new_password_hash = User.hash_password(req.body.password, new_password_salt);                 
                const db = mongoose.connection;
                db.on("error", function() {return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG))});
                db.once("open", function() {

                    User.findOneAndUpdate({username: decoded_string.username}, {hashed_password: new_password_hash, salt: new_password_salt}, function(error, doc, result) {
                        if (error) return reject(new api_response(false, app_constants.signup_error.UNKNOWN_VALIDATION_ERROR_MSG));
                        if (!doc) return reject(new api_response(false, app_constants.general_error.USER_CANNOT_BE_FOUND));
                        else {
                            const transporter = nodemailer.createTransport({
                                service: "gmail",
                                auth: {
                                    user: process.env.SUPPORT_EMAIL,
                                    pass: process.env.SUPPORT_EMAIL_PASSWORD
                                }
                            });
                            const mail_options = {
                                from: process.env.SUPPORT_EMAIL,
                                to: doc.email_address,
                                subject: app_constants.nodemailer_settings.password_reset_success_email_subject(app_constants.app_configuration.app_name),
                                html: `${app_constants.nodemailer_settings.password_reset_success_email_html}<p>Thank you for using ${app_constants.app_configuration.app_name}!</p>${app_constants.nodemailer_settings.check_out_author_other_project(app_constants.app_configuration.author, app_constants.app_configuration.author_link)}`
                            }

                            transporter.sendMail(mail_options, function(error, info) {
                                if (error) return reject(new api_response(false, app_constants.signup_error.UNKNOWN_MAIL_SENDING_ERROR_MSG));
                                else return resolve(web_token);
                            })
                        }
                    })
                })
            }
            else if (error.name === "TokenExpiredError") {
                return reject(new api_response(false, app_constants.signup_error.EXPIRED_TOKEN_SIGNUP_ERROR_MSG));
            }
            else if (error.name === "JsonWebTokenError") {return reject(new api_response(false, app_constants.signup_error.MALFORMED_TOKEN_SIGNUP_ERROR_MSG));}
            else if (error.name === "NotBeforeError") {return reject(new api_response(false, app_constants.signup_error.NOT_BEFORE_ERROR_TOKEN_SIGNUP_ERROR_MSG));}
            else return reject(new api_response(false, app_constants.signup_error.UNKNOWN_VALIDATION_ERROR_MSG));
        })
    })
}

module.exports = {
    register_user,
    login_user,
    logout_user,
    reset_password,
    reset_password_confirm,
    send_verification_mail,
    verify_account,
    verify_password_token
}

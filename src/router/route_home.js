const express = require("express");
const {app_configuration} = require("../app_constants");
const app_constants = require("../app_constants");
const home_router = express.Router();
const controller = require("../controllers/index");
const cryptokeys = require("../cryptokeys");

function set_cookies_and_session_data(req, res) {
    const user_session_salt = cryptokeys.generate_salt(app_constants.cookies.USER_SESSION_SALT_SIZE);
    const user_session_id_hash = cryptokeys.hash_password(req.sessionID, user_session_salt);
    req.session[app_constants.cookies.USER_LOGGED_IN] = true;
    req.session[app_constants.cookies.USER_SESSION_ID] = req.sessionID;
    req.session[app_constants.session_data.USERNAME] = req.body.username;
    req.session[app_constants.cookies.USER_SESSION_SALT] = user_session_salt;
    req.session[app_constants.cookies.USER_SESSION_HASH] = user_session_id_hash;
    res.cookie(app_constants.cookies.USER_LOGGED_IN, true);
    res.cookie(app_constants.cookies.USER_SESSION_ID, req.sessionID);
    res.cookie(app_constants.cookies.USER_SESSION_SALT, user_session_salt);
    res.cookie(app_constants.cookies.USER_SESSION_HASH, user_session_id_hash);
}

home_router.get(app_configuration.home, function(req, res) {
        res.render("layout/home", {
        title: `${app_configuration.app_name} | ${app_configuration.app_description}`, 
        replace_title: true,
        app_configuration,
        error: req.cookies[app_constants.cookies.ERROR],
        cookies: req.cookies,
        cookies_constant: app_constants.cookies
    });
});

home_router.get(app_configuration.help_page, function(req, res) {
    res.render("layout/help", {
        title: `Help`,
        app_configuration,
        cookies: req.cookies,
        cookies_constant: app_constants.cookies
    })
})

home_router.get(app_configuration.about_page, function(req, res) {
    res.render("layout/about", {
        title: `About`,
        app_configuration,
        cookies: req.cookies,
        cookies_constant: app_constants.cookies
    });
});

home_router.get(app_configuration.login, function(req, res) {
    if (req.cookies[app_constants.cookies.USER_SESSION_ID]) res.redirect(app_configuration.home);
    else {
        res.render("users/login", {
            title: "Login",
            app_configuration,
            error: req.cookies.error,
            cookies: req.cookies,
            cookies_constant: app_constants.cookies
        })
    }
});

home_router.post(app_configuration.login, function(req, res) {
    controller.users.login_user(req, res, req.body.username, req.body.password)
    .then(function() {
        set_cookies_and_session_data(req, res);
        
        res.redirect(app_configuration.home);
    })
    .catch(function(error) {
        console.log(error);
        res.cookie(app_constants.cookies.ERROR, error.extra);
        
        res.redirect(app_configuration.login_page);
    })
})

home_router.get(app_configuration.signup, function(req, res) {
    if (req.cookies[app_constants.cookies.USER_SESSION_ID]) res.redirect(app_configuration.home);
    const error_message = (req.cookies.error) ? JSON.parse(req.cookies.error) : undefined;
    res.render("users/signup", {
        title: "Sign Up",
        app_configuration,
        error: error_message,
        cookies: req.cookies,
        cookies_constant: app_constants.cookies
    });
});

home_router.post(app_configuration.signup, function(req, res) {
    controller.users.register_user(req, res, req.body.username, req.body.email_address, req.body.password)
    .then(function() {
        set_cookies_and_session_data(req, res);
        
        res.redirect(app_configuration.home);
    })
    .catch(function(error) {
        console.log(error);
        const error_messages = {};
        if (error) {
            for (const field in error.extra.errors) {error_messages[field] = error.extra.errors[field].message;}
            res.cookie(app_constants.cookies.ERROR, JSON.stringify(error_messages));
        }
        
        res.redirect(app_configuration.signup_page);
    });
});

home_router.get(app_configuration.logout, function(req, res) {
    controller.users.logout_user(req, res)
    .then(function() {
        res.clearCookie(app_constants.cookies.USER_LOGGED_IN);
        res.clearCookie(app_constants.cookies.USER_SESSION_ID);
        res.clearCookie(app_constants.cookies.USER_SESSION_SALT);
        res.clearCookie(app_constants.cookies.USER_SESSION_HASH);
        res.redirect(app_configuration.home);
    })
    .catch(function(error) {
        console.log(error);
        if (error) res.cookie(app_constants.cookies.ERROR, error.extra);
        if (!req.cookies[app_constants.cookies.USER_SESSION_ID]) res.cookie(app_constants.cookies.ERROR, error.extra);
        res.redirect(app_configuration.home);
    });
});

home_router.get(app_configuration.reset_password, function(req, res) {
    if (req.cookies[app_constants.cookies.USER_SESSION_ID]) res.redirect(app_configuration.home);
    else {
        res.render("users/reset_password", {
            title: "Reset password",
            app_configuration,
            error: req.cookies[app_constants.cookies.ERROR]
        })
    }
});

home_router.post(app_configuration.reset_password, function(req, res) {
    controller.users.reset_password(req.body.email_address)
    .then(
        // if successful, send the email 
        // generate a token to be used for the reset password confirm page
        // when the reset process was successful, the page will close down
        
    )
    .catch(function(error) {
        // if not, then eh...
        console.log(error);
        res.cookie(app_constants.cookies.ERROR, error.extra);
        res.redirect(app_configuration.reset_password);
    });
});

// TODO: Reset Password Confirm
// * After the email from the reset password was sent a page will be live for only a few hours
// * If it expires, the page will be nonexistent and cannot be accessed anymore until such a case that the same token was generated
// * If the password replacement process on the password confirm page was successsful, the page will also be closed
// * There should be another email to be sent confirming the password reset 

module.exports = home_router;

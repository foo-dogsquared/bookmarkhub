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
        success: req.cookies[app_constants.cookies.SUCCESS],
        cookies: req.cookies,
        cookies_constant: app_constants.cookies
    });
});

home_router.post(app_configuration.signup, function(req, res) {
    controller.users.register_user(req, res, req.body[app_configuration.form_fields.username], req.body[app_configuration.form_fields.email_address], req.body[app_configuration.form_fields.password], req.body[app_configuration.form_fields.confirm_password])
    .then(function() {
        res.redirect(app_configuration.verification_email_sent_page);
    })
    .catch(function(error) {
        const error_messages = {};
        if (error) {
            for (const field in error.extra.errors) {error_messages[field] = error.extra.errors[field].message;}
            res.cookie(app_constants.cookies.ERROR, JSON.stringify(error_messages));
        }
        
        res.redirect(app_configuration.signup_page);
    });
});

home_router.get(app_configuration.verification_email_sent_page, function(req, res, next) {
    if (req.originalUrl === app_configuration.verification_email_sent_page) res.redirect(app_configuration.home);
    else if (req.method !== "POST" && req.originalUrl !== app_configuration.signup_page) res.redirect(req.originalUrl);
    else {
        res.render("users/verification_email_sent", {
            title: "Verification email sent",
            app_configuration,
            cookies: req.cookies,
            cookies_constant: app_constants.cookies,
            error: req.cookies[app_constants.cookies.ERROR]
        })
    }
})

home_router.get(`${app_configuration.account_confirmation}/:jwt`, function(req, res, next) {
    controller.users.verify_account(req, res, req.params.jwt)
    .then(function() {
        res.render("accounts/verification_success", {
            title: "Verification success!",
            app_configuration,
            cookies: req.cookies,
            cookies_constant: app_constants.cookies
        });
    })
    .catch(function(error) {
        res.cookie(app_constants.cookies.ERROR, error.extra);
        res.redirect(app_configuration.home);
    })
})

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
        if (error) res.cookie(app_constants.cookies.ERROR, error.extra);
        res.clearCookie(app_constants.cookies.USER_LOGGED_IN);
        res.clearCookie(app_constants.cookies.USER_SESSION_ID);
        res.clearCookie(app_constants.cookies.USER_SESSION_SALT);
        res.clearCookie(app_constants.cookies.USER_SESSION_HASH);
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
            error: req.cookies[app_constants.cookies.ERROR],
            cookies: req.cookies,
            cookies_constant: app_constants.cookies
        })
    }
});

home_router.post(app_configuration.reset_password, function(req, res) {
    controller.users.reset_password(req, res, req.body[app_configuration.form_fields.email_address])
    .then(function() {
        res.redirect(app_configuration.home);
    })
    .catch(function(error) {
        // if not, then eh...
        console.log(error);
        res.cookie(app_constants.cookies.ERROR, error.extra).redirect(app_configuration.reset_password_page);
    });
});

home_router.get(`${app_configuration.reset_password_confirm}/:jwt`, function(req, res, next) {
    controller.users.verify_password_token(req, res, req.params.jwt)
    .then(function(decoded_string) {
        // when reset password confirmation process is successful
        res.render("users/reset_password_confirm", {
            title: "Reset the password (for sure)",
            app_configuration,
            cookies: req.cookies,
            cookies_constant: app_constants.cookies
        })
    })
    .catch(function(error) {
        // otherwise
        res.render("users/reset_password_confirm_fail", {
            title: error.extra,
            app_configuration,
            cookies: req.cookies,
            cookies_constant: app_constants.cookies,
            token_error_message: error.extra
        })
    })
})

home_router.post(`${app_configuration.reset_password_confirm}/:jwt`, function(req, res, next) {
    controller.users.reset_password_confirm(req, res, req.params.jwt)
    .then(function() {
        res.cookie(app_constants.cookies.SUCCESS, app_constants.signup_success.SIGNUP_SUCCESSFUL_MSG);
        res.redirect(app_configuration.home);
    })
    .catch(function(error) {
        res.cookie(app_constants.cookies.ERROR, error.extra);
        res.redirect(app_configuration.home)
    })
})

module.exports = home_router;

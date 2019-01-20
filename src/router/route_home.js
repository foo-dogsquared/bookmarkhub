const express = require("express");
const {app_configuration} = require("../app_constants");
const app_constants = require("../app_constants");
const home_router = express.Router();
const controller = require("../controllers/index");


home_router.get(app_configuration.home, function(req, res) {
        res.render("layout/home", {
        title: `${app_configuration.app_name} | ${app_configuration.app_description}`, 
        replace_title: true,
        app_configuration,
        error: req.cookies[app_constants.cookies.ERROR],
        user_session_id: req.cookies[app_constants.cookies.USER_SESSION_ID]
    });
});

home_router.get(app_configuration.help_page, function(req, res) {
    res.render("layout/help", {
        title: `Help`,
        app_configuration,
        user_session_id: req.cookies[app_constants.cookies.USER_SESSION_ID]
    })
})

home_router.get(app_configuration.about_page, function(req, res) {
    res.render("layout/about", {
        title: `About`,
        app_configuration,
        user_session_id: req.cookies[app_constants.cookies.USER_SESSION_ID]
    });
});

home_router.get(app_configuration.login, function(req, res) {
    if (req.cookies[app_constants.cookies.USER_SESSION_ID]) res.redirect(app_configuration.home);
    else {
        res.render("users/login", {
            title: "Login",
            app_configuration,
            error: req.cookies.error,
            user_session_id: req.cookies[app_constants.cookies.USER_SESSION_ID]
        })
    }
});

home_router.post(app_configuration.login, function(req, res) {
    controller.users.login_user(req, res, req.body.username, req.body.password)
    .then(function() {
        req.session[app_constants.cookies.USER_LOGGED_IN] = true;
        req.session[app_constants.cookies.USER_SESSION_ID] = req.sessionID;
        req.session[app_constants.session_data.USERNAME] = req.body.username;
        res.cookie(app_constants.cookies.USER_LOGGED_IN, true);
        res.cookie(app_constants.cookies.USER_SESSION_ID, req.sessionID)
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
        user_session_id: req.cookies[app_constants.cookies.USER_SESSION_ID]
    });
});

home_router.post(app_configuration.signup, function(req, res) {
    controller.users.register_user(req, res, req.body.username, req.body.email_address, req.body.password)
    .then(function() {
        req.session[app_constants.cookies.USER_LOGGED_IN] = true;
        req.session[app_constants.cookies.USER_SESSION_ID] = req.sessionID;
        req.session[app_constants.session_data.USERNAME] = req.body.username;
        res.cookie(app_constants.cookies.USER_LOGGED_IN, true);
        res.cookie(app_constants.cookies.USER_SESSION_ID, req.sessionID)
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
            app_configuration
        })
    }
});

home_router.post(app_configuration.reset_password, function(req, res) {
    controller.users.reset_password(email_address)
    .then()
    .catch();
})

module.exports = home_router;

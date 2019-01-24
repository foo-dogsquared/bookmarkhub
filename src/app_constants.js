const dotenv = require("dotenv").config();
// Pug gives undefined for objects with reference to `this`
// and it also might go under change so that's why they're outside of the
// object
const account = "/account";
const login = "/login";
const signup = "/signup";
const logout = "/logout";
const reset_password = "/reset-password";
const reset_password_confirm = "/reset-password-confirm";
const user = "/user";
const profile = "/profile";
const bookmarks_page = "/submit-bookmarks";
const edit_description = "/edit-description";
const account_confirmation = "/confirmation";
const profile_page = `${account}${profile}`;
const submit_bookmarks_uri = `${account}${bookmarks_page}`;
const own_bookmarks = `${profile}${bookmarks_page}`;
const login_page = `${login}`;
const signup_page = `${signup}`;
const logout_page = `${logout}`;
const reset_password_page = `${reset_password}`;
const reset_password_confirm_page = `${reset_password_confirm}`;
const edit_description_uri = `${account}${edit_description}`;
const account_confirmation_uri = `${account}${account_confirmation}`;
const verification_email_sent_page = "/verify-email-sent";
const help_page = "/help";
const about_page = "/about";

// the entire app configuration
// these are mostly used for the view templates
exports.app_configuration = {
    // app information
    author: "Gabriel Arazas",
    alias: "foo-dogsquared",
    author_link: "https://foo-dogsquared.github.io/",
    author_social_links: {
        github: "https://github.com/foo-dogsquared",
        twitter: "https://twitter.com/foo_dogsquared"
    },
    app_link: (process.env.NODE_ENV === "development") ? "http://localhost:8989" : process.env.APP_LINK,
    app_name: "bookmarkhub",
    app_icon: "📖",
    app_description: "A bookmark sharing site or something...",
    app_repo_link: "https://github.com/foo-dogsquared/bookmarkhub",
    issue_tracker_link: "https://github.com/foo-dogsquared/bookmarkhub/issues",
    
    // routes
    home: "/",
    google_analytics_id: process.env.GOOGLE_ANALYTICS_ID,
    bookmarks_page,
    submit_bookmarks_uri,
    account,
    signup,
    login,
    logout,
    reset_password,
    reset_password_confirm,
    user,
    account_confirmation,
    profile,
    profile_page,
    own_bookmarks,
    edit_description,
    signup_page,
    login_page,
    logout_page,
    reset_password_page,
    reset_password_confirm_page,
    edit_description_uri,
    account_confirmation_uri,
    verification_email_sent_page,
    help_page,
    about_page,

    // form fields
    form_fields: {
        bookmarks: "bookmarks",
        description: "description",
        email_address: "email_address",
        password: "password",
        username: "username",
        confirm_password: "confirm_password"
    },
}

exports.invalid_usernames = [
    about_page,
    help_page,
    login,
    logout,
    signup,
    account_confirmation,
    reset_password,
    reset_password_confirm,
    user,
    profile,
    account,
    verification_email_sent_page
]

// account configurations
const password_minimum_length = 8;
const username_maximum_length = 256;
const password_maximum_length = 512;
const description_maxlength = 512;
const bookmarks_maximum_size = 5242880; // 5 MB * (1024 KB / 1 MB) * (1024 B / 1 KB)
exports.password_minimum_length = password_minimum_length;
exports.bookmarks_maximum_size = bookmarks_maximum_size;  
exports.description_maxlength = description_maxlength;
exports.username_maximum_length = username_maximum_length;
exports.password_maximum_length = password_maximum_length;
exports.account_name_allowed_characters = /[A-Za-z0-9_]/gi;
exports.account_name_disallowed_characters = /[^A-Za-z0-9_]/gi;
exports.cookies = {
    ERROR: "error",
    SUCCESS: "success",
    USER_LOGGED_IN: "user_logged_in",
    USER_SESSION_ID: "user_session_id",
    SESSION_ID: "session_id",
    MAX_AGE: 1209600000, // 14 days * (24 hours / 1 day) * (60 minutes / 1 hour) * (60 seconds / 1 minute) * (1000 milliseconds / 1 second)
    USER_SESSION_ID_COPY: "user_session_id_copy",
    USER_SESSION_HASH: "user_session_hash",
    USER_SESSION_SALT: "user_session_salt",
    USER_SESSION_VALIDATED: "user_session_validated",
    USER_SESSION_HASH_LENGTH: 50,
    USER_SESSION_HASH_ITERATION: 5,
    USER_SESSION_SALT_SIZE: 10,
    USER_SESSION_HASH_ALGO: "sha512",
    USER_SESSION_VALIDATED_VALUE: "OK"
}
exports.session_data = {
    USERNAME: "username"
}

// database
exports.mongodb_db_url = process.env.MONGODB_URL || "mongodb://localhost:27017/test"
exports.mongodb_user_collection = "User";
exports.MONGODB_ERROR_CONNECTION_MSG = "Database connection error.";

// signup error messages
exports.signup_error = {
    UNIQUE_EMAIL_ADDRESS_SIGNUP_ERROR_MSG: "Email address already exists.",
    BLANK_EMAIL_ADDRESS_SIGNUP_ERROR_MSG: "Email cannot be blank.",
    EMAIL_ADDRESS_VALIDATION_SIGNUP_ERROR_MSG: "Email is not valid.",
    MINIMUM_PASSWORD_LENGTH_SIGNUP_ERROR_MSG: `Password must have at least ${password_minimum_length} characters.`,
    MAXIMUM_PASSWORD_LENGTH_SIGNUP_ERROR_MSG: `Password should contain only up to ${password_maximum_length} characters.`,
    BLANK_PASSWORD_SIGNUP_ERROR_MSG: "Password cannot be blank.", 
    UNIQUE_USERNAME_SIGNUP_ERROR_MSG: "Username already exists.",
    INVALID_USERNAME_SIGNUP_ERROR_MSG: "You cannot set the specified username.",
    MAXIMUM_USERNAME_LENGTH_SIGNUP_ERROR_MSG: `Usernames should contain only up to ${username_maximum_length} characters.`,
    INVALID_CHARACTERS_ON_USERNAME_SIGNUP_ERROR_MSG: "Username must only have alphanumeric characters and underscores.",
    BLANK_USERNAME_SIGNUP_ERROR_MSG: "Username cannot be blank.",
    CONFIRM_PASSWORD_DOES_NOT_MATCH_INPUT_PASSWORD_SIGNUP_ERROR_MSG: "Confirm password does not match your password input.",
    UNKNOWN_VALIDATION_ERROR_MSG: "Validation has gone wrong for unknown reasons.",
    UNKNOWN_MAIL_SENDING_ERROR_MSG: "Verification e-mail has failed to send.",
    EXPIRED_TOKEN_SIGNUP_ERROR_MSG: "Token has expired. Please sign up again.",
    MALFORMED_TOKEN_SIGNUP_ERROR_MSG: "Token has malformed.",
    NOT_BEFORE_ERROR_TOKEN_SIGNUP_ERROR_MSG: "Current claiming time is when the token is not active.",
    ACCOUNT_VERIFICATION_SUCCESSFUL: "Your account has been verified! Thank you for trying this little program of mine. 😊",
    GENERIC_INVALID_VERIFICATION_PROCESS_ERROR_MSG: "Verification process has gone wrong.",
    UNKNOWN_SIGNUP_ERROR: "Some error has occured. Please contact the support.",
}

exports.signup_success = {
    SIGNUP_SUCCESSFUL_MSG: "Signup process is successful! There should be an email to validate your account."
}

// login error messages
exports.login_error = {
    INVALID_USERNAME_LOGIN_ERROR_MSG: "Found no such username in the database.",
    INVALID_PASSWORD_LOGIN_ERROR_MSG: "Password does not match with the username.",
    BLANK_USERNAME_LOGIN_ERROR_MSG: "Username cannot be blank.",
    BLANK_PASSWORD_LOGIN_ERROR_MSG: "Password cannot be blank.",
    SERVER_LOGIN_ERROR: "There's a problem with the server.",
    ACCOUNT_NOT_CONFIRMED_LOGIN_ERROR_MSG: "Credentials match but you're not verified. Have you opened your verification email yet?"
}

// logout error messages
exports.logout_error = {
    LOGOUT_ERROR_MESSAGE: "Logout error.",
    INVALID_USER_STATE_LOGOUT_ERROR_MESSAGE: "You're not a user at the time of logging out."
}

// reset password error messages
exports.reset_password_error = {
    BLANK_EMAIL_ADDRESS_RESET_PASSWORD_ERROR_MSG: "Email address is blank.",
    BLANK_PASSWORD_RESET_ERROR_MSG: "Password cannot be blank.",
    CONFIRM_PASSWORD_MISMATCH_RESET_ERROR_MSG: "Confirm password field value does not match your password.",
    EXPIRED_PASSWORD_RESET_TOKEN_ERROR_MSG: "Password reset token has been expired. Please claim another one by going to the password reset page again.",
    INVALID_EMAIL_ADDRESS_RESET_PASSWORD_ERROR_MSG: "Given email was invalid.",
    MALFORMED_PASSWORD_RESET_TOKEN_ERROR_MSG: "Password reset token has been corrupted.",
    MAXIMUM_PASSWORD_LENGTH_RESET_ERROR_MSG: `Password should have a maximum of 512 characters.`,
    NO_EMAIL_ADDRESS_FOUND_RESET_PASSWORD_ERROR_MSG: "Given email was not found in the database.",
    NOT_BEFORE_RESET_ERROR_TOKEN_ERROR_MSG: "Password reset token has been claimed before the token is active.",
    PASSWORD_LENGTH_RESET_PASSWORD_ERROR_MSG: "Length of the new password should at least 8 characters.",
    SENDING_PASSWORD_RESET_EMAIL_FAIL_ERROR_MSG: "Sending of the password reset email has failed. Please try again.",
    UNKNOWN_RESET_PASSWORD_TOKEN_ERROR: "Password reset token process has unknown errors."
}

// reset password success messages
exports.reset_password_success = {
    RESET_PASSWORD_CONFIRM_SUCCESS: "Reset password process has been successful."
}

// general error messages
exports.general_error = {
    DESCRIPTION_CANNOT_BE_EDITED: "Description cannot be edited.",
    DESCRIPTION_INVALID_ERROR_MSG: "Description must contain at least one non-whitespace character.",
    DESCRIPTION_LENGTH_ERROR: `Description can only have a maximum of ${description_maxlength} characters.`,
    INVALID_USER_PAGE: "Username is not valid.",
    USER_CANNOT_BE_FOUND: "Specified user cannot be found."
}

exports.bookmark_error = {
    INVALID_BOOKMARKS_ERROR_MSG: "Bookmark file is not valid.",
    MAXIMUM_BOOKMARK_SIZE_LIMIT_ERROR_MSG: `Maximum bookmark size allowed is up to ${Math.floor(bookmarks_maximum_size / (1024 * 1024))} MB.`,
    INVALID_NETSCAPE_HTML_BOOKMARK_ERROR_MSG: "HTML file is not in Netscape or Pocket format.",
    INVALID_BROWSER_BOOKMARK_JSON_ERROR_MSG: "JSON file is not in valid bookmark format.",
    NO_FILE_MSG_ERROR: "Think you can pass without a file? Ha! Not so fast... 😁"
}

exports.nodemailer_settings = {
    transporter: {
        service: "gmail",
        auth: {
            user: process.env.SUPPORT_EMAIL,
            pass: process.env.SUPPORT_EMAIL_PASSWORD
        }
    },
    verification_initialization_email_subject: "Welcome to bookmarkhub!",
    verification_initialization_email_html: `<h1>Hello and thank you for using bookmarkhub! 😁</h1><p>Now verify your account by clicking the following link: </p>`,
    verification_success_email_subject: "Verification success!",
    verification_success_email_html: "<h1>Your account has been verified! 😁</h1><p>Now you are truly welcome to bookmarkhub. Don't forget to share this with your friends or somebody who might need it or just someone.</p>",
    password_reset_token_email_subject: function(app_name) {return `${app_name} Password Token Request`} ,
    password_reset_token_email_html: "<p>Just click the following link to confirm the reset of your password. Make sure to make it more memorable this time. 🙂</p><p>Also take note that the link is only valid for an hour.</p>",
    password_reset_success_email_subject: function(app_name) {return `${app_name} Password Reset Success`},
    password_reset_success_email_html: "<p>Nicely done!</p><p>Hope you continue using my project!</p>",
    email_options: function(email_from, email_to, subject, html) {
        return {
            from: email_from,
            to: email_to,
            subject,
            html
        }
    },
    created_by: function(author, author_link) {
        return `<a href=${author_link}>${author}</a>`;
    },
    check_out_author_other_project: function(author, author_link) {
        return `<p>On that note, why don't you check out <a href=${author_link}>${author}</a>'s other projects? 😁`
    }
}

// Pug gives undefined for objects with reference to `this`
const account = "/account";
const login = "/login";
const signup = "/signup";
const logout = "/logout";
const reset_password = "/reset-password";
const reset_password_confirm = "/reset-password-confirm";
const login_page = `${login}`;
const signup_page = `${signup}`;
const logout_page = `${logout}`;
const reset_password_page = `${reset_password}`;
const reset_password_confirm_page = `${reset_password_confirm}`;

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
    app_name: "bookmarkhub",
    app_icon: "📖",
    app_description: "A bookmark sharing site or something...",
    app_repo_link: "https://github.com/foo-dogsquared/bookmarkhub",

    
    // routes
    home: "/",
    bookmarks_page: "/bookmarks",
    account,
    signup,
    login,
    logout,
    reset_password,
    reset_password_confirm,
    signup_page,
    login_page,
    logout_page,
    reset_password_page,
    reset_password_confirm_page,
    page: "/page",
    help_page: "/help",
    about_page: "/about"
}

// account configurations
exports.password_minimum_length = 8;
exports.bookmarks_maximum_size = 5242880; // 5 MB * (1024 KB / 1 MB) * (1024 B / 1 KB) 
exports.account_name_allowed_characters = /[A-Za-z0-9_]/gi;
exports.account_name_disallowed_characters = /[^A-Za-z0-9_]/gi;
exports.cookies = {
    ERROR: "error",
    USER_LOGGED_IN: "user_logged_in",
    USER_SESSION_ID: "user_session_id",
    SESSION_ID: "session_id",
    MAX_AGE: 1209600000, // 14 days * (24 hours / 1 day) * (60 minutes / 1 hour) * (60 seconds / 1 minute) * (1000 milliseconds / 1 second)
    USER_SESSION_ID_COPY: "user_session_id_copy"
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
    MINIMUM_PASSWORD_LENGTH_SIGNUP_ERROR_MSG: "Password must have at least 8 characters.",
    BLANK_PASSWORD_SIGNUP_ERROR_MSG: "Password cannot be blank.", 
    UNIQUE_USERNAME_SIGNUP_ERROR_MSG: "Username already exists.",
    INVALID_USERNAME_SIGNUP_ERROR_MSG: "You cannot set the specified username.",
    INVALID_CHARACTERS_ON_USERNAME_SIGNUP_ERROR_MSG: "Username must only have alphanumeric characters and underscores."
}

// login error messages
exports.login_error = {
    INVALID_USERNAME_LOGIN_ERROR_MSG: "Found no such username in the database.",
    INVALID_PASSWORD_LOGIN_ERROR_MSG: "Password does not match with the username.",
    SERVER_LOGIN_ERROR: "There's a problem with the server."
}

// logout error messages
exports.logout_error = {
    LOGOUT_ERROR_MESSAGE: "Logout error.",
    INVALID_USER_STATE_LOGOUT_ERROR_MESSAGE: "You're not a user at the time of logging out."
}

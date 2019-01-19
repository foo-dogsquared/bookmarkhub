const account = "/account";
const login = "/login";
const signup = "/signup";
const logout = "/logout";
const login_page = `${account}${login}`;
const signup_page = `${account}${signup}`;
const logout_page = `${account}${logout}`;

exports.app_configuration = {
    // app information
    app_name:  "bookmarkhub",
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
    signup_page,
    login_page,
    logout_page,
    page: "/page",
    help_page: "/help",
    about_page: "/about"
}

// account configurations
exports.password_minimum_length = 8;
exports.bookmarks_maximum_size = 5242880; // 5 MB * (1024 KB / 1 MB) * (1024 B / 1 KB) 
exports.cookies = {
    ERROR: "error",
    USER_LOGGED_IN: "user_logged_in",
    SESSION_ID: "session_id",
    MAX_AGE: 1209600000 // 14 days * (24 hours / 1 day) * (60 minutes / 1 hour) * (60 seconds / 1 minute) * (1000 milliseconds / 1 second)
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
    UNIQUE_USERNAME_SIGNUP_ERROR_MSG: "Username already exists."
}

// login error message
exports.login_error = {
    INVALID_USERNAME_LOGIN_ERROR_MSG: "Found no such username in the database.",
    INVALID_PASSWORD_LOGIN_ERROR_MSG: "Password does not match with the username.",
    SERVER_LOGIN_ERROR: "There's a problem with the server."
}

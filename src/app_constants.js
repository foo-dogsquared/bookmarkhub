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
const profile_page = `${account}${profile}`;
const submit_bookmarks_uri = `${account}${bookmarks_page}`;
const own_bookmarks = `${profile}${bookmarks_page}`;
const login_page = `${login}`;
const signup_page = `${signup}`;
const logout_page = `${logout}`;
const reset_password_page = `${reset_password}`;
const reset_password_confirm_page = `${reset_password_confirm}`;
const edit_description_uri = `${account}${edit_description}`;

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
    page: "/page",
    help_page: "/help",
    about_page: "/about",

    // form fields
    form_fields: {
        bookmarks: "bookmarks",
        description: "description",
        email_address: "email_address",
        password: "password",
        username: "username",
        confirm_password: "confirm_password"
    }
}

// account configurations
exports.password_minimum_length = 8;
exports.bookmarks_maximum_size = 5242880; // 5 MB * (1024 KB / 1 MB) * (1024 B / 1 KB) 
exports.description_maxlength = 512;
exports.account_name_allowed_characters = /[A-Za-z0-9_]/gi;
exports.account_name_disallowed_characters = /[^A-Za-z0-9_]/gi;
exports.cookies = {
    ERROR: "error",
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

exports.verification_email_settings = {
    subject: "Welcome to bookmarkhub!",
    html: `<h1>Hello and thank you for using bookmarkhub! 😁</h1><p>Now verify your account by clicking the following link: </p>`
}

// signup error messages
exports.signup_error = {
    UNIQUE_EMAIL_ADDRESS_SIGNUP_ERROR_MSG: "Email address already exists.",
    BLANK_EMAIL_ADDRESS_SIGNUP_ERROR_MSG: "Email cannot be blank.",
    EMAIL_ADDRESS_VALIDATION_SIGNUP_ERROR_MSG: "Email is not valid.",
    MINIMUM_PASSWORD_LENGTH_SIGNUP_ERROR_MSG: "Password must have at least 8 characters.",
    BLANK_PASSWORD_SIGNUP_ERROR_MSG: "Password cannot be blank.", 
    UNIQUE_USERNAME_SIGNUP_ERROR_MSG: "Username already exists.",
    INVALID_USERNAME_SIGNUP_ERROR_MSG: "You cannot set the specified username.",
    INVALID_CHARACTERS_ON_USERNAME_SIGNUP_ERROR_MSG: "Username must only have alphanumeric characters and underscores.",
    CONFIRM_PASSWORD_DOES_NOT_MATCH_INPUT_PASSWORD_SIGNUP_ERROR_MSG: "Confirm password does not match your password input."
}

// login error messages
exports.login_error = {
    INVALID_USERNAME_LOGIN_ERROR_MSG: "Found no such username in the database.",
    INVALID_PASSWORD_LOGIN_ERROR_MSG: "Password does not match with the username.",
    SERVER_LOGIN_ERROR: "There's a problem with the server.",
    ACCOUNT_NOT_CONFIRMED_LOGIN_ERROR_MSG: "Credentials match but you're not verified. Have you opened your verification email yet?"
}

// logout error messages
exports.logout_error = {
    LOGOUT_ERROR_MESSAGE: "Logout error.",
    INVALID_USER_STATE_LOGOUT_ERROR_MESSAGE: "You're not a user at the time of logging out."
}

exports.reset_password_error = {
    INVALID_EMAIL_ADDRESS_RESET_PASSWORD_ERROR_MSG: "Given email was invalid.",
    NO_EMAIL_ADDRESS_FOUND_RESET_PASSWORD_ERROR_MSG: "Given email was not found in the database."
}

// general error messages
exports.general_error = {
    INVALID_USER_PAGE: "Username is not valid.",
    USER_CANNOT_BE_FOUND: "Specified user cannot be found.",
    DESCRIPTION_CANNOT_BE_EDITED: "Description cannot be edited.",
    DESCRIPTION_LENGTH_ERROR: "Description can only have a maximum of 512 characters.",
    DESCRIPTION_INVALID_ERROR_MSG: "Description must contain at least one non-whitespace character."
}

exports.bookmark_error = {
    INVALID_BOOKMARKS_ERROR_MSG: "Bookmark file is not valid.",
    MAXIMUM_BOOKMARK_SIZE_LIMIT_ERROR_MSG: `Maximum bookmark size allowed is up to 5 MB.`,
    INVALID_NETSCAPE_HTML_BOOKMARK_ERROR_MSG: "HTML file is not in Netscape or Pocket format.",
    INVALID_BROWSER_BOOKMARK_JSON_ERROR_MSG: "JSON file is not in valid bookmark format.",
    NO_FILE_MSG_ERROR: "Think you can pass without a file? Ha! Not so fast... 😁"
}

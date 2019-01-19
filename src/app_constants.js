// app configrations
const APP_NAME = "bookmarkhub";
const APP_DESCRIPTION = "A bookmark sharing site or something...";
const APP_REPO_LINK = "https://github.com/foo-dogsquared/bookmarkhub";

// routes
const HOME = "/";
const BOOKMARKS = "/bookmarks";
const ACCOUNT = "/account";
const LOGIN_PAGE = `${ACCOUNT}/login`;
const SIGNUP_PAGE = `${ACCOUNT}/signup`
const PAGE = "/page";
const HELP = "/help";
const ABOUT = "/about";

// account configurations
const PASSWORD_MINIMUM_LENGTH = 8;
const BOOKMARK_MAXIMUM_SIZE = 5242880; // 5 MB * (1024 KB / 1 MB) * (1024 B / 1 KB) 
const MONGODB_DB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/test"

module.exports = {
    app_description: APP_DESCRIPTION,
    app_name: APP_NAME,
    app_repo_link: APP_REPO_LINK,
    home: HOME,
    bookmarks_page: BOOKMARKS,
    account: ACCOUNT,
    page: PAGE,
    login_page: LOGIN_PAGE,
    signup_page: SIGNUP_PAGE,
    help_page: HELP,
    about_page: ABOUT,
    password_minimum_length: PASSWORD_MINIMUM_LENGTH,
    mongodb_db_url: MONGODB_DB_URL
}
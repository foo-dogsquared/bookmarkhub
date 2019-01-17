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

module.exports = {
    APP_DESCRIPTION,
    APP_NAME,
    APP_REPO_LINK,
    HOME,
    BOOKMARKS,
    ACCOUNT,
    PAGE,
    LOGIN_PAGE,
    SIGNUP_PAGE,
    HELP,
    ABOUT
}
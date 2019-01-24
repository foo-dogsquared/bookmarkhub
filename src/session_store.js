const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
const app_constants = require("./app_constants");

const session_store = new MongoDBStore({
    uri: app_constants.mongodb_db_url,
    collection: "sessions"
});

module.exports = session_store;
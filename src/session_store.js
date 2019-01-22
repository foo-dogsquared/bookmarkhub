const session = require('express-session');
const MongoDBStore = require("connect-mongo")(session);
const app_constants = require("./app_constants");

const session_store = new MongoDBStore({
    url: app_constants.mongodb_db_url,
    ttl: 60 * 60 * 24 * 14,
    collection: "sessions",
    db: "test",
    touchAfter: 60 * 60 * 24,
    autoRemove: "native",
    stringify: false
});

module.exports = session_store;
const app_constants = require("./app_constants");
try {
    var crypto = require("crypto");
} catch (error) {
    console.error("Crypto module is not supported yet.");
}

function generate_salt(bits) {
    return crypto.randomBytes(bits).toString("hex");
}

function hash_password(string, salt) {
    return crypto.pbkdf2Sync(
        string, 
        salt, 
        app_constants.cookies.USER_SESSION_HASH_ITERATION, 
        app_constants.cookies.USER_SESSION_HASH_LENGTH, 
        app_constants.cookies.USER_SESSION_HASH_ALGO
    ).toString("hex");
}

module.exports = {
    generate_salt,
    hash_password
}

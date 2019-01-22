const app_constants = require("../app_constants");
const api_response = require("../models/api_response");
const user_schema = require("../models/user");
const mongoose = require("mongoose");
const session_store = require("../session_store");
const cryptokeys = require("../cryptokeys");
const bookmark_parser = require("../parser");

function retrieve_user(req, res, username) {
    mongoose.connect(app_constants.mongodb_db_url, {useNewUrlParser: true});

    return new Promise(function(resolve, reject) {
        const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);
        const db = mongoose.connection;

        db.on("error", function() {
            console.error(app_constants.MONGODB_ERROR_CONNECTION_MSG);
            return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG));
        });
        db.once("open", function() {
            User.findOne({username: username}, function(error, result) {
                if (error) return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG));
                if (result) {
                    const user_object = {username: result.username, bookmarks: result.bookmarks, description: result.description}
                    return resolve(user_object);
                }
                else return reject(new api_response(false, app_constants.general_error.USER_CANNOT_BE_FOUND))
            });
        }) 
    })
}

function check_for_session(req) {
    const req_session_salt = req.cookies[app_constants.cookies.USER_SESSION_SALT]
    const req_session_hash = req.cookies[app_constants.cookies.USER_SESSION_HASH]
    const req_session_id = req.cookies[app_constants.cookies.USER_SESSION_ID]
    return new Promise(function(resolve, reject) {
        if (req_session_hash && req_session_salt && req_session_id
            && cryptokeys.hash_password(req_session_id, req_session_salt) === req_session_hash) {
            
            session_store.get(req.cookies[app_constants.cookies.USER_SESSION_ID], function(error, session) {
                if (error) return reject(new api_response(false))
                
                if (session) return resolve(session);
                else return reject(new api_response(false));
            });
        }
        else return reject(new api_response(false));
    });
}

function edit_description(req, res, description) {
    mongoose.connect(app_constants.mongodb_db_url, {useNewUrlParser: true});

    return new Promise(function(resolve, reject) {
        const db = mongoose.connection;
        const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);

        db.on("error",function() {return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG))});
        db.once("open", function() {
            check_for_session(req)
            .then(function(session) {
                User.findOneAndUpdate({username: session.username}, {description: description}, {runValidators: true}, function(error, doc, result) {
                    if (error) return reject(new api_response(false, error));

                    if (!doc) return reject(new api_response(false, app_constants.general_error.USER_CANNOT_BE_FOUND));
                    else return resolve(new api_response(true));
                })
            })
            .catch(function() {
                return reject(new api_response(false));
            })
        })
    })
}

function save_bookmark(req, res, bookmark_file) {
    mongoose.connect(app_constants.mongodb_db_url, {useNewUrlParser: true});
    const db = mongoose.connection;
    const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);
    console.log(bookmark_file);
    return new Promise(function(resolve, reject) {
        if (!bookmark_file) return reject(new api_response(false, app_constants.bookmark_error.NO_FILE_MSG_ERROR))
        if (bookmark_file.size > app_constants.bookmarks_maximum_size) return reject(new api_response(false, app_constants.bookmark_error.MAXIMUM_BOOKMARK_SIZE_LIMIT_ERROR_MSG));

        db.on("error", function() {
            return reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG));
        })

        console.log(bookmark_file);
        if (bookmark_file.mimetype === "text/html" || bookmark_file.mimetype === "application/json") {
            const bookmark_object = bookmark_parser.parse_bookmark(bookmark_file.originalname, bookmark_file.buffer);
            if (!bookmark_object) return reject(new api_response(false, app_constants.bookmark_error.INVALID_BOOKMARKS_ERROR_MSG));

            db.once("open", function() {
                check_for_session(req)
                .then(function(session) {
                    User.findOneAndUpdate({username: session.username}, {bookmarks: bookmark_object}, function(error, doc, result) {
                        if (error) return reject(new api_response(false, app_constants.bookmark_error.INVALID_BOOKMARKS_ERROR_MSG));

                        if (!doc) return reject(new api_response(false, app_constants.general_error.USER_CANNOT_BE_FOUND));
                        else return resolve(bookmark_object);
                    })
                })
                .catch(function() {
                    return reject(new api_response(false, app_constants.general_error.INVALID_USER_PAGE));
                })
            })
        }
        else return reject(new api_response(false, app_constants.bookmark_error.INVALID_BOOKMARKS_ERROR_MSG));
    })
}

module.exports = {
    retrieve_user,
    check_for_session,
    edit_description,
    save_bookmark
}

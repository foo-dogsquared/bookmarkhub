const app_constants = require("../app_constants");
const api_response = require("../models/api_response");
const user_schema = require("../models/user");
const mongoose = require("mongoose");
const session_store = require("../session_store");
const cryptokeys = require("../cryptokeys");

function retrieve_user(req, res, username) {
    mongoose.connect(app_constants.mongodb_db_url, {useNewUrlParser: true});

    return new Promise(function(resolve, reject) {
        const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);
        const db = mongoose.connection;

        db.on("error", function() {
            console.error(app_constants.MONGODB_ERROR_CONNECTION_MSG);
            reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG));
        });
        db.once("open", function() {
            User.findOne({username: username}, function(error, result) {
                if (error) reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG));
                if (result) {
                    const user_object = {username: result.username, bookmarks: result.bookmarks, description: result.description}
                    resolve(user_object);
                }
                else reject(new api_response(false, app_constants.general_error.USER_CANNOT_BE_FOUND))
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
                if (error) reject(new api_response(false))
                
                if (session) resolve(session);
                else reject(new api_response(false));
            });
        }
        else reject(new api_response(false));
    });
}

function edit_description(req, res, description) {
    mongoose.connect(app_constants.mongodb_db_url, {useNewUrlParser: true});

    return new Promise(function(resolve, reject) {
        const db = mongoose.connection;
        const User = mongoose.model(app_constants.mongodb_user_collection, user_schema);

        db.on("error",function() {reject(new api_response(false, app_constants.MONGODB_ERROR_CONNECTION_MSG))});
        db.once("open", function() {
            check_for_session(req)
            .then(function(session) {
            User.findOneAndUpdate({username: session.username}, {description: description}, {runValidators: true}, function(error, doc, result) {
                if (error) reject(new api_response(false, app_constants.general_error.DESCRIPTION_LENGTH_ERROR));

                if (!doc) reject(new api_response(false, app_constants.general_error.USER_CANNOT_BE_FOUND));
                else resolve(new api_response(true));
                })
            })
        })
    })
}

module.exports = {
    retrieve_user,
    check_for_session,
    edit_description
}

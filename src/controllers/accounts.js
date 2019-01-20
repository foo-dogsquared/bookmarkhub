const app_constants = require("../app_constants");
const api_response = require("../models/api_response");
const user_schema = require("../models/user");
const mongoose = require("mongoose");

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
                if (result) resolve();
                else reject(new api_response(false))
            });
        }) 
    })
}

module.exports = {
    retrieve_user
}
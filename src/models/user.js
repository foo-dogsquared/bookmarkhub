const mongoose = require("mongoose");
const bookmarks_schema = require("./bookmarks");
const app_constants = require("../app_constants");
const email_validator = require("email-validator");
try {
    var crypto = require("crypto");
} catch(err) {
    console.error("Crypto support is disabled.");
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    salt: {
        type: String
    },
    hashed_password: {
        type: String
    },
    bookmarks: bookmarks_schema
});

// Virtuals (getter and setter)
UserSchema.virtual(app_constants.app_configuration.form_fields.password)
    .get(function() { return this._password })
    .set(function(password) {
        this._password = password;
        this.salt = this.generate_salt(16);
        this.hashed_password = this.hash_password(this._password, this.salt);
});

UserSchema.virtual(app_constants.app_configuration.form_fields.confirm_password)
    .get(function() { return this._confirm_password })
    .set(function(confirm_password) {this._confirm_password = confirm_password;});

// Validations
UserSchema.path("username").validate(function(username) {
    const User = mongoose.model("User");

    return new Promise(function(resolve, reject) {
        if (!username) reject();
    
        User.findOne({username: username}, function(error, result) {
            if (error) reject(error);
            if (result) reject();
            else resolve();
        });
    });
}, app_constants.signup_error.UNIQUE_USERNAME_SIGNUP_ERROR_MSG)

UserSchema.path("username").validate(function(username) {
    if (username.match(/log-?in/gi) 
    || username.match(/sign-?up/gi) 
    || username.match(/reset-?password/gi) 
    || username.match(/reset-?password-?confirm/gi)
    || username.match(/profile/gi)
    || username.match(/user/gi)) 
        return false;
    else return true; 
}, app_constants.signup_error.INVALID_USERNAME_SIGNUP_ERROR_MSG);

UserSchema.path("username").validate(function(username) {
    if (username.match(app_constants.account_name_disallowed_characters)) return false;
    else return true;
}, app_constants.signup_error.INVALID_CHARACTERS_ON_USERNAME_SIGNUP_ERROR_MSG);

UserSchema.path("email_address").validate(function(email_address_name) {
    const User = mongoose.model("User");

    return new Promise(function(resolve, reject) {
        if (!email_address_name.length) reject();

        User.findOne({email_address: email_address_name}, function(error, result) {
            if (error) reject(error);

            if (result) reject(error);
            else resolve(); 
        });
    });
}, app_constants.signup_error.UNIQUE_EMAIL_ADDRESS_SIGNUP_ERROR_MSG);

UserSchema.path("email_address").validate(function(email_address_name) {
    if (email_address_name.length <= 0) return false;
    else return true;
}, app_constants.signup_error.BLANK_EMAIL_ADDRESS_SIGNUP_ERROR_MSG)

UserSchema.path("email_address").validate(function(email_address_name) {
    if (email_validator.validate(email_address_name)) return true;
    else return false;
}, app_constants.signup_error.EMAIL_ADDRESS_VALIDATION_SIGNUP_ERROR_MSG)

UserSchema.path("description").validate(function(description) {
    if (description.length > app_constants.description_maxlength) return false;
    else return true;
}, app_constants.general_error.DESCRIPTION_LENGTH_ERROR);

UserSchema.path("description").validate(function(description) {
    if (description.match(/\S+/gi)) return true;
    else return false;
}, app_constants.general_error.DESCRIPTION_INVALID_ERROR_MSG);

UserSchema.path("hashed_password").validate(function(hashed_password) {
    if (this._password.length <= 0) return false;
    else return true;
}, app_constants.signup_error.BLANK_PASSWORD_SIGNUP_ERROR_MSG);

UserSchema.path("hashed_password").validate(function(hashed_password) {
    if (this._password.length < 8) return false;
    else return true;
}, app_constants.signup_error.MINIMUM_PASSWORD_LENGTH_SIGNUP_ERROR_MSG)

UserSchema.path("hashed_password").validate(function(hashed_password) {
    if (this._password !== this._confirm_password) return false;
    else return true;
}, app_constants.signup_error.CONFIRM_PASSWORD_DOES_NOT_MATCH_INPUT_PASSWORD_SIGNUP_ERROR_MSG);

// Methods
UserSchema.method("generate_salt", function(bits) {
    return crypto.randomBytes(bits).toString("hex");
});

UserSchema.method("hash_password", function(password, salt) {
    const hash_buffer = crypto.pbkdf2Sync(password, salt, 512, 64, "sha512");

    return hash_buffer.toString("hex");
});

UserSchema.method("validate_password", function() {
    return this.hash_password(this._password) === this.hashed_password;
});

//  Static methods
UserSchema.static("hash_password", function(password, salt) {
    const hash_buffer = crypto.pbkdf2Sync(password, salt, 512, 64, "sha512");

    return hash_buffer.toString("hex");
});

UserSchema.static("generate_salt", function(bits) {
    return crypto.randomBytes(bits).toString("hex");
});

UserSchema.static("find_by_username", function(name, callback) {
    return this.find({username: name}, callback(err, result));
});

module.exports = UserSchema;

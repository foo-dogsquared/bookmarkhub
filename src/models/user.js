const mongoose = require("mongoose");
const bookmarks_schema = require("./bookmarks");
try {
    var crypto = require("crypto");
} catch(err) {
    console.error("Crypto support is disabled.");
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 256
    },
    email_address: {
        type: String,
        required: true
    },
    salt: {
        type: String
    },
    hashed_password: {
        type: String
    },
    session_id: {
        type: String
    },
    bookmarks: bookmarks_schema
});

// Virtuals (getter and setter)
UserSchema.virtual("_password")
    .get(function() { return this._password })
    .set(function(password) {
        this._password = password;
        this.salt = this.generate_salt();
        this.hashed_password = this.hash_password(password, this.salt);
    });

// Validations
UserSchema.path("email_address").validate(function(email_address_name) {
    const User = mongoose.model("User", UserSchema);

    User.find({email_address: email_address_name})
    .then(function (email_address) {console.log(email_address); return true})
    .catch(function (error) { return error; });

}, "Email address already exists.");

UserSchema.path("hashed_password").validate(function(hashed_password) {
    if (this._password.length >= 0 && this.hashed_password) return false;
    else return true;
}, "Password cannot be blank.");

// Methods
UserSchema.method("generate_salt", function(max = 65555) {
    return String(Math.round((new Date().valueOf() * Math.random()) / Math.floor((Math.random() + 1) * max)));
});

UserSchema.method("hash_password", function(password, salt) {
    return crypto.scrypt(password, salt, 64, function(err, derivedKey) {
        if (err) throw err;
        return derivedKey.toString("hex");
    })
});

UserSchema.method("validate_password", function() {
    return this.hash_password(this._password) === this.hashed_password;
});

module.exports = UserSchema;
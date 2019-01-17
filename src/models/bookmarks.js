const mongoose = require("mongoose");

const bookmarks_schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    root_name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    children: {
        type: Object,
        required: true
    }
}, {_id: false})

module.exports = bookmarks_schema;
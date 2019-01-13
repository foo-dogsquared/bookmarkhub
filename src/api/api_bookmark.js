const express = require("express");
const parser = require("../parser");
const path = require("path");

const bookmark_router = express.Router();

bookmark_router.get("/", function(req, res) {
    console.log(__dirname);
    res.render("bookmarks/bookmark", {object: parser.parse_bookmark("test\\bookmarks_file\\chrome_test_bookmark.html")})
})

module.exports = bookmark_router;
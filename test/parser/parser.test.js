const parser = require("../../src/parser");
const fs = require("fs");

const big_bookmark = fs.readFileSync("test\\bookmarks_file\\firefox_test_bookmark.html");
const small_bookmarks = fs.readFileSync("test\\bookmarks_file\\small_bookmark.html");


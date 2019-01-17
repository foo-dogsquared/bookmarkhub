const express = require("express");
const parser = require("../parser");

const bookmark_router = express.Router();

bookmark_router.get("/", function(req, res) {
    console.log(__dirname);
})

module.exports = bookmark_router;

const fs = require("fs");
const path = require("path");
const parser_json = require("./parser_json");
const parser_netscape = require("./parser_netscape");
const parser_pocket = require("./parser_pocket");

const BOOKMARK_MAXIMUM_SIZE = 5242880 // 5 MB * (1024 KB / 1 MB) * (1024 B / 1 KB) 

function parse_bookmark(filepath, buffer) {
    if (buffer.length > BOOKMARK_MAXIMUM_SIZE) throw new Error(`File size exceeded maximum allowed size of ${Math.floor(BOOKMARK_MAXIMUM_SIZE / Math.pow(1024, 2))} MB`);
    console.log(`Parsing a file named: ${filepath}`);
    const file_ext_name = path.extname(filepath).toLowerCase();
    if (file_ext_name === ".html" || file_ext_name === ".htm") {
        if (parser_netscape.is_netscape(buffer))
            return parser_netscape.parse_netscape(buffer);
        else if (parser_pocket.is_pocket(buffer)) 
            return parser_pocket.parse_pocket(buffer);
    }
    else if (file_ext_name === ".json") {
        if (parser_json.is_json(buffer))
            return parser_json.parse_json(buffer);
    }
    else
        throw new Error("The given file is not supported yet.");
}

module.exports = {
    parse_bookmark,
    BOOKMARK_MAXIMUM_SIZE
}
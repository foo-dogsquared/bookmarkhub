const fs = require("fs");
const path = require("path");
const parser_json = require("./parser_json");
const parser_netscape = require("./parser_netscape");
const parser_pocket = require("./parser_pocket");

const BOOKMARK_MAXIMUM_SIZE = 5242880 // 5 MB * (1024 KB / 1 MB) * (1024 B / 1 KB) 

function parse_bookmark(filepath) {
    const bookmark_text = fs.readFileSync(filepath, {encoding: "utf8"});
    if (bookmark_text.length > BOOKMARK_MAXIMUM_SIZE) throw new Error(`File size exceeded maximum allowed size of ${Math.floor(BOOKMARK_MAXIMUM_SIZE / Math.pow(1024, 2))} MB`)

    const file_ext_name = path.extname(filepath).toLowerCase();
    if (file_ext_name === "html" || file_ext_name === "htm") {
        if (parser_netscape.is_netscape(bookmark_text))
            return parser_netscape.parse_netscape(bookmark_text);
        else if (parser_pocket.is_pocket(bookmark_text)) 
            return parser_pocket.parse_pocket(bookmark_text);
    }
    else if (file_ext_name === "json") {
        if (parser_json.is_json(bookmark_text))
            return parser_json.parse_json(bookmark_text);
    }
    else
        throw new Error("The given file is not supported yet.");
}

module.exports = {
    parse_bookmark,
    BOOKMARK_MAXIMUM_SIZE
}
const fs = require("fs");
const os = require("os");
const path = require("path");
const parser_json = require("./parser_json");
const parser_netscape = require("./parser_netscape");
const parser_pocket = require("./parser_pocket");

function parse_bookmark(filepath) {
    const bookmark_text = fs.readFileSync(filepath, {encoding: "utf8"});

    const file_ext_name = path.extname(filepath).toLowerCase();
    if (file_ext_name === "html" || file_ext_name === "htm") {
        if (parser_netscape.is_netscape(bookmark_text))
            parser_netscape.parse_netscape(bookmark_text);
        else if (parser_pocket.is_pocket(bookmark_text)) 
            parser_pocket.parse_pocket(bookmark_text);
    }
    else if (parser_json.is_json(bookmark_text))
        parser_json.parse_json(bookmark_text);
    else
        throw new Error("The given file is not supported yet.");
}
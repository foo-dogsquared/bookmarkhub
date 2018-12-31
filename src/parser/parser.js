const fs = require("fs");
const parser_netscape = require("./parser_convert_netscape");

function parse_bookmark(filepath) {
    const bookmark_text = fs.readFileSync(filepath, {encoding: "utf8"});

    if (parser_netscape.is_netscape(bookmark_text))
        parser_netscape.parse_netscape(bookmark_text);
    else if (parser_json.is_json(bookmark_text))
        parser_json.parse_json(bookmark_text);
}
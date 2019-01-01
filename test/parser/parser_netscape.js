const assert = require('assert');
const fs = require("fs");
const parser_src = require('../../src/parser/parser_netscape');

const complete_netscape_obj = {
    "title": "Bookmarks", 
    "type": "netscape", 
    "root_name": "Bookmarks menu", 
    "children": {
        "Bookmarks bar": {
            "Most Visited": "place:sort=8&maxResults=10",
            "Getting Started": "https://www.mozilla.org/en-GB/firefox/central/"
        },
        "Mozilla Firefox": {
            "Help and Tutorials": "https://support.mozilla.org/en-GB/products/firefox",
            "Customize Firefox": "https://support.mozilla.org/en-GB/kb/customize-firefox-controls-buttons-and-toolbars?utm_source=firefox-browser&utm_medium=default-bookmarks&utm_campaign=customize",
            "Get Involved": "https://www.mozilla.org/en-GB/contribute/",
            "About Us": "https://www.mozilla.org/en-GB/about/"
        },
        "Recent Tags": "place:type=6&sort=14&maxResults=10"
    }
};

const bookmark_text = fs.readFileSync("test\\bookmarks_file\\small_bookmark.html", {encoding: "utf8"});

describe(`Validating a Netscape bookmark HTML file`, function() {
    it(`should detect that it is a valid Netscape bookmark file from its DOCTYPE`, function() {
        assert.deepStrictEqual(parser_src.is_netscape(bookmark_text), true);
    });
});

describe(`Parsing through a Netscape bookmark HTML file with common cases`, function() {
    it(`should detect the type of the bookmark to be imported`, function() {
        assert.deepStrictEqual(parser_src.parse_netscape(bookmark_text).type, "netscape");
    });

    it(`should detect the title of the HTML bookmark file`, function() {
        assert.deepStrictEqual(parser_src.parse_netscape(bookmark_text).title, "Bookmarks");
    });

    it(`should detect the root name of the HTML bookmark file (the one that is enclosed in <H1> tag)`, function() {
        assert.deepStrictEqual(parser_src.parse_netscape(bookmark_text).root_name, "Bookmarks Menu");
    });

    it(`should detect the children of the root`, function() {
        assert.deepStrictEqual(Object.getOwnPropertyNames(parser_src.parse_netscape(bookmark_text)).length, 3);
    });

    it(`should create the object of the HTML body correctly`, function() {
        assert.deepStrictEqual(parser_src.parse_netscape(bookmark_text).children, complete_netscape_obj.children);
    });

    it(`should return an object with the bookmarks from the generated HTML from bookmarks`, function() {
        assert.deepStrictEqual(parser_src.parse_netscape(bookmark_text), complete_netscape_obj);
    });

})

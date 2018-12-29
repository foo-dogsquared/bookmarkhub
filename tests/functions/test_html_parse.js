const assert = require('assert');
const parser_src = require('../../src/parser/parser_convert_netscape');

const complete_netscape_obj = {
    "title": "Bookmarks", 
    "type": "netscape", 
    "root_name": "Bookmarks menu", 
    "children": [
        {"Recent Tags": "place:type=6&sort=14&maxResults=10"},
        {"Mozilla Firefox": {
            "Help and Tutorials": "https://support.mozilla.org/en-GB/products/firefox",
            "Customize Firefox": "https://support.mozilla.org/en-GB/kb/customize-firefox-controls-buttons-and-toolbars?utm_source=firefox-browser&utm_medium=default-bookmarks&utm_campaign=customize",
            "Get Involved": "https://www.mozilla.org/en-GB/contribute/",
            "About Us": "https://www.mozilla.org/en-GB/about/"
            }
        },
        {"Bookmarks bar": {
            "Most Visited": "place:sort=8&maxResults=10",
            "Getting Started": "https://www.mozilla.org/en-GB/firefox/central/"
            }
        }
    ]
};

describe(`Validating a Netscape bookmark HTML file`, function() {
    it(`should detect that it is a valid Netscape bookmark file from its DOCTYPE`, function() {
        assert.deepStrictEqual(parser_src.is_netscape("tests\\bookmarks_file\\small_bookmark.html"), true);
    });

    it(`should throw an exception that does not detect the Netscape format from the DOCTYPE tag`, function() {
        assert.deepStrictEqual(parser_src.is_netscape("tests\\bookmarks_file\\small_bookmark.html"), new Error("Bookmark file is not in Netscape format"));
    });

    it(`should detect the title of the HTML bookmark file`, function() {
        assert.deepStrictEqual(parser_src.parse_title("tests\\bookmarks_file\\small_bookmark.html"), {title: "Bookmarks"});
    });

    it(`should return an object with the bookmarks from the generated HTML from bookmarks`, function() {
        assert.deepStrictEqual(parser_src.parse_netscape("tests\\bookmarks_file\\small_bookmark.html"), complete_netscape_obj);
    });

});

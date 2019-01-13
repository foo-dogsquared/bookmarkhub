const assert = require("assert");
const parser_url = require("../../src/parser/parser_url");

const large_netscape_bookmark_url = "https://www-archive.mozilla.org/quality/browser/front-end/testcases/bookmarks/large-bookmarks.html";

describe(`Parsing through the bookmark from a URL`, function() {
    it(`should able to detect whether it is a valid Netscape bookmark`, function() {
        assert.ok(parser_url.parse_url(large_netscape_bookmark_url));
    });
})

const assert = require("assert");
const fs = require("fs");
const parser_pocket = require("../../src/parser/parser_pocket");

const pocket_export = fs.readFileSync("test\\bookmarks_file\\pocket_export_file.html", {encoding: "utf8"});

const complete_pocket_obj = {
    "type": "pocket",
    "root_name": "Bookmarks",
    "title": "Pocket Export",
}

describe(`Validating the file that it is in Pocket format`, function() {
    it(`should return true`, function() {
        assert.deepStrictEqual(parser_pocket.is_pocket(pocket_export));
    });
});

describe(`Parsing through the Pocket export file with usual cases`, function() {
    it(`should return the title correctly`, function() {
        assert.deepStrictEqual(parser_pocket.parse_pocket(pocket_export).title, "Pocket Export");
    });

    it(`should return the type correctly`, function() {
        assert.deepStrictEqual(parser_pocket.parse_pocket(pocket_export).type, "pocket");
    });

    it(`should return the root name correctly`, function() {
        assert.deepStrictEqual(parser_pocket.parse_pocket(pocket_export).type, "Bookmarks");
    });

    it(`should parse through the children with the correct tags correctly`, function() {
        assert.ok(parser_pocket.parse_pocket(pocket_export));
    });
})
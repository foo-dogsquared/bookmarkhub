//  TODO: Parse through the JSON file that is exported from browsers
const assert = require("assert");
const fs = require("fs");
const parser_json = require("../../src/parser/parser_json");

const valid_test_json = fs.readFileSync("test\\bookmarks_file\\json_bookmarks.json");
const invalid_test_json = "";

describe(`Validating whether or not the file is in JSON export format`, function() {
    it(`File given is a valid JSON file to parse through`, function() {
        assert.deepStrictEqual(parser_json.is_json(valid_test_json), true);
    })

    it(`File given does not have the valid key-value fields`, function() {
        assert.deepStrictEqual(parser_json.is_json(), false);
    })
})

describe(`Parsing through the valid JSON export file`, function() {
    it(`should give the correct type`, function() {
        assert.deepStrictEqual(parser_json.parse_json_export(valid_test_json).type, "json");
    });

    it(`should give the correct title`, function() {
        assert.deepStrictEqual(parser_json.parse_json_export(valid_test_json).type, "Bookmarks");
    });

    it(`should give the correct root name`, function() {
        assert.deepStrictEqual(parser_json.parse_json_export(valid_test_json).type, "placesRoot");
    });

    it(`should give the correct children`, function() {
        assert.deepStrictEqual(parser_json.parse_json_export(valid_test_json).type, complete_json_obj.children);
    });
})
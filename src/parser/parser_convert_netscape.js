const fs = require("fs");
const os = require("os");
const path = require("path");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

function is_netscape(file_text) {
    const netscape_doctype_string = `<!DOCTYPE NETSCAPE-Bookmark-file-1>`;
    if (file_text.substring(0, netscape_doctype_string.length) === netscape_doctype_string)
        return true;
    else
        return false;
}

function parse_netscape(file_text) {
    const {document: html_dom_tree} = (new JSDOM(file_text)).window;
    const bookmark_obj = {};
    if (html_dom_tree.doctype.name.toLowerCase() === `NETSCAPE-Bookmark-file-1`.toLowerCase()) bookmark_obj["type"] = "netscape";
    else throw new Error("File does not detect the NETSCAPE doctype tag.");
    
    if (html_dom_tree.title) bookmark_obj["title"] = html_dom_tree.title;
    else bookmark_obj["title"] = "Bookmarks";

    const root_name = html_dom_tree.body.querySelector("h1").textContent;
    if (root_name) bookmark_obj["root_name"] = root_name;
    else bookmark_obj["root_name"] = "Bookmarks";

    const root_children_dom = html_dom_tree.body.querySelector("dl");
    
    bookmark_obj["children"] = html_dom_to_json(root_children_dom);
    
    return bookmark_obj;
}

function html_dom_to_json(bookmark_item_dom, object = {}) {
    // parses through the HTML DOM tree
    for (const node of bookmark_item_dom.children) {
        if (node.children.length > 0 && node.nodeName === "DT") {
            if (node.children[0].nodeName === "A") object[node.children[0].textContent] = node.children[0].href; 
            else if (node.children[0].nodeName === "H3") {
                Object.defineProperty(object, node.children[0].textContent, {value: {}});
                console.log(node.children[0].textContent);
                html_dom_to_json(node.children[1], object[node.children[0].textContent]);
            }
        }
    }

    return object;
}

module.exports = {
    is_netscape,
    html_dom_to_json,
    parse_netscape
};

const jsdom = require("jsdom");
const {JSDOM} = jsdom;

function is_netscape(file_text) {
    const netscape_doctype_string = `NETSCAPE-Bookmark-file-1`.toLowerCase();
    const doctype = (new JSDOM(file_text)).window.document.doctype.name.toLowerCase();
    if (doctype === netscape_doctype_string)
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
            // the base case: when the bookmark item is a link
            const bookmark_item_node = node.children[0];
            if (bookmark_item_node.nodeName === "A") {
                const bookmark_href = bookmark_item_node.href;
                const protocol = bookmark_href.split(":")[0];
                if (protocol === "http" || protocol === "https" || protocol === "ftp") object[bookmark_item_node.textContent] = bookmark_href;
                else continue;
            }
            else if (bookmark_item_node.nodeName === "H3") {
                object[bookmark_item_node.textContent] = {};
                if (!node.children[1]) continue;
                html_dom_to_json(node.children[1], object[bookmark_item_node.textContent]);
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

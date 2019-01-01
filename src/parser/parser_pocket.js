const jsdom = require("jsdom");
const {JSDOM} = jsdom;

function is_pocket(filetext) {
    const {document} = (new JSDOM(filetext)).window;
    const doctype = document.doctype.name.toLowerCase();
    const title = document.title.toLowerCase();

    if (doctype === "html" && title === "pocket export")
        return true;
    else
        return false;
}

function parse_pocket(filetext) {
    const bookmark_obj = {};
    const {document: html_dom_tree} = (new JSDOM(filetext)).window;
    
    if (document.title.toLowerCase === "pocket export") {
        bookmark_obj["type"] = "pocket";
        bookmark_obj["title"] = document.title;
    }
    else throw new Error("Imported bookmark is not a Pocket export file.");

    bookmark_obj["children"] = pocket_body_to_json(document.body);

    return bookmark_obj;
}

function pocket_body_to_json(body, object = {}) {
    for (const node of body.children) {
        if (node.nodeName === "UL" || node.nodeName === "OL") pocket_body_to_json(node, object);
        else if (node.nodeName === "LI") check_anchor_tags(node);
    }

    return object;
}

function check_anchor_tags(LI_node) {
    if (LI_node.children[0].nodeName === "A")  {
        const anchor_node = LI_node.children[0];
        let link_tags = anchor_node.getAttribute("tags");
        if (!link_tags) {
            link_tags = link_tags.split(",");
            if (link_tags.length > 0)  {
                for (const tag of link_tags) {
                    if (tag.trim() !== " ")  {
                        if (!object[tag]) Object.defineProperty(object, tag, {value: {}});
                        object[tag][anchor_node.textContent] = anchor_node.href;
                    }
                    else object[anchor_node.textContent] = anchor_node.href;
                }
            }
            else {
                object[anchor_node.textContent] = anchor_node.href;
                continue;
            }
        }
    }
}

module.exports = {
    is_pocket,
    parse_pocket
}
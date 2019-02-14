const bookmark_root_folder = document.querySelector(".bookmarks");
bookmark_root_folder.addEventListener("click", function(event) {
    const target = event.target;
    if (target.tagName === "DIV" && target.classList.contains("bookmark-folder")) {
        const bookmark_item_child = target.nextElementSibling;
        bookmark_item_child.classList.toggle("active");
    }
})

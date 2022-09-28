export function changeThemeColor(color) {
    if (color === undefined || color === "") {
        document.querySelector("meta[name=theme-color]").removeAttribute("content");
    } else {
        document.querySelector("meta[name=theme-color]").setAttribute("content", color);
    }
}

export function changeGlobalCss(href) {
    let link$ = document.getElementById("global_css");
    if (link$ === null) {
        link$ = document.createElement("link");
        link$.id = "global_css";
        link$.rel = "stylesheet";
        link$.href = href
        document.head.appendChild(link$);
    } else {
        if (href === undefined || href === "") {
            link$.remove();
        } else {
            link$.setAttribute("href", href);
        }
    }
}
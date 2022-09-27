export function changeThemeColor(color) {
    if (color === undefined || color === "") {
        document.querySelector("meta[name=theme-color]").removeAttribute("content");
    } else {
        document.querySelector("meta[name=theme-color]").setAttribute("content", color);
    }
}
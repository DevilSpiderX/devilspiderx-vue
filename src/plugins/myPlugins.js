export function setThemeColor(color) {
    if (color === undefined || color === "") {
        document.querySelector("meta[name=theme-color]").removeAttribute("content");
    } else {
        document.querySelector("meta[name=theme-color]").setAttribute("content", color);
    }
}

export function getTheme() {
    let arcoTheme = document.body.getAttribute("arco-theme");
    if (arcoTheme === null) return "light";
    return arcoTheme;
}

export function changeTheme(themeName) {
    if (themeName) {
        document.body.setAttribute("arco-theme", themeName);
        return;
    }
    let arcoTheme = getTheme();
    if (arcoTheme === "light") {
        document.body.setAttribute("arco-theme", "dark");
    } else if (arcoTheme === "dark") {
        document.body.removeAttribute("arco-theme");
    }
}

export default {
    install(app) {
        app.config.globalProperties.setThemeColor = setThemeColor;
        app.config.globalProperties.getTheme = getTheme;
        app.config.globalProperties.changeTheme = changeTheme;
        app.config.globalProperties.isTouchDevice = "ontouchstart" in window && navigator.maxTouchPoints !== 0;
    }
}
export function setThemeColor(color) {
    let meta = document.querySelector("meta[name=theme-color]");
    if (meta === null) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "theme-color");
        document.head.append(meta);
    }
    if (color === undefined || color === "") {
        meta.removeAttribute("content");
    } else {
        meta.setAttribute("content", color);
    }
}

export function getTheme() {
    let arcoTheme = document.body.getAttribute("arco-theme");
    return arcoTheme === null ? "light" : arcoTheme;
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

export function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(duration);
        }, duration);
    });
}

const MyPlugins = {
    install(app) {
        app.config.globalProperties.setThemeColor = setThemeColor;
        app.config.globalProperties.getTheme = getTheme;
        app.config.globalProperties.changeTheme = changeTheme;
        app.config.globalProperties.isTouchDevice = "ontouchstart" in window && navigator.maxTouchPoints !== 0;
        app.config.globalProperties.sleep = sleep;
    }
}

export default MyPlugins;
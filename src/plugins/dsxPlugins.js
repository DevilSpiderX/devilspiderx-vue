function setThemeColor(color) {
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

function getTheme() {
    let arcoTheme = document.body.getAttribute("arco-theme");
    return arcoTheme === null ? "light" : arcoTheme;
}

function changeTheme(themeName) {
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

function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(duration);
        }, duration);
    });
}

const isTouchDevice = "ontouchstart" in window && navigator.maxTouchPoints !== 0;

const DsxPlugins = {
    install(app) {
        app.config.globalProperties.$dsxPlugins = this;
    },
    setThemeColor, getTheme, changeTheme, sleep, isTouchDevice
}

export default DsxPlugins;
export { setThemeColor, getTheme, changeTheme, sleep, isTouchDevice }
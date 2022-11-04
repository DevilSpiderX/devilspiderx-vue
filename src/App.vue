<template>
    <router-view></router-view>
</template>

<script>
const appSettings = {
    darkTheme: false,
    themeFollowSystem: false
}
{
    let settings = window.localStorage.getItem("appSettings");
    if (settings === null) {
        window.localStorage.setItem("appSettings", JSON.stringify(appSettings));
    } else {
        Object.assign(appSettings, JSON.parse(settings));
    }
}
export default {
    name: 'App',
    data() {
        return {
            appSettings: appSettings
        }
    },
    watch: {
        appSettings: {
            handler(newVal) {
                console.log('App配置已被修改', newVal);
                window.localStorage.setItem("appSettings", JSON.stringify(this.appSettings));
            },
            deep: true
        },
        "appSettings.darkTheme"(newVal) {
            this.changeTheme(newVal ? "dark" : "light");
        },
        "appSettings.themeFollowSystem"(newVal) {
            if (newVal) {
                this.setThemeFollowSystem();
            }
        }
    },
    beforeMount() {
        if (this.appSettings.darkTheme) {
            this.changeTheme();
        }
        if (this.appSettings.themeFollowSystem) {
            this.setThemeFollowSystem();
        }
    },
    methods: {
        setThemeFollowSystem() {
            this.appSettings.darkTheme = window.matchMedia('(prefers-color-scheme:dark)').matches;
        }
    }
}
</script>

<style>
body {
    font-family: MiSans-Normal, Inter, "-apple-system", BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "noto sans", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
    background-color: var(--color-bg-1);
    margin: 0;
}

@font-face {
    font-family: MiSans-Normal;
    src: url("./font/MiSans-Normal.ttf");
}

:root {
    --shadow-special: 0 0 1px rgba(0, 0, 0, 0.3);
    --shadow1-center: 0 -2px 5px rgba(0, 0, 0, 0.1);
    --shadow2-center: 0 0 10px rgba(0, 0, 0, 0.1);
    --shadow3-center: 0 0 20px rgba(0, 0, 0, 0.1);
    --box-shadow: 0px 12px 32px 4px #0000000a, 0px 8px 20px #00000014;
    --box-shadow-light: 0px 0px 12px #0000001f;
    --box-shadow-lighter: 0px 0px 6px #0000001f;
    --box-shadow-dark: 0px 16px 48px 16px #00000014, 0px 12px 32px #0000001f, 0px 8px 16px -8px #00000029;
}

</style>

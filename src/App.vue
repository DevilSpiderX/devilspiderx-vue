<script setup>
import { onBeforeMount, provide, reactive, watch } from "vue";
import { changeTheme } from "./plugins/myPlugins.js";

const appSettings = reactive({
    darkTheme: false,
    themeFollowSystem: false
});
provide("appSettings", appSettings);
{
    let settings = window.localStorage.getItem("appSettings");
    if (settings === null) {
        window.localStorage.setItem("appSettings", JSON.stringify(appSettings));
    } else {
        Object.assign(appSettings, JSON.parse(settings));
    }
}

watch(appSettings, newVal => {
    console.log('App配置已被修改', newVal);
    window.localStorage.setItem("appSettings", JSON.stringify(appSettings));
});

watch(() => appSettings.darkTheme, newVal => {
    changeTheme(newVal ? "dark" : "light");
});

watch(() => appSettings.themeFollowSystem, newVal => {
    if (newVal) {
        setThemeFollowSystem();
    }
});

onBeforeMount(() => {
    if (appSettings.darkTheme) {
        changeTheme("dark");
    }
    if (appSettings.themeFollowSystem) {
        setThemeFollowSystem();
    }
    window.matchMedia('(prefers-color-scheme:dark)').addEventListener("change", prefers_color_scheme_change);
})

function setThemeFollowSystem() {
    appSettings.darkTheme = window.matchMedia('(prefers-color-scheme:dark)').matches;
}

function prefers_color_scheme_change(e) {
    console.log(e)
    if (appSettings.themeFollowSystem) {
        setThemeFollowSystem();
    }
}

</script>

<template>
    <router-view/>
</template>

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

<script setup>
import { onBeforeMount, ref } from "vue";
import { useAppConfigs } from "./store/AppConfigsStore";
import http from "./scripts/server-api.js";

window.appInited = ref(false);
const appConfigs = useAppConfigs();

onBeforeMount(() => {
    window.matchMedia("(prefers-color-scheme:dark)").onchange = event => {
        if (appConfigs.themeFollowSystem) {
            appConfigs.darkTheme = event.matches;
        }
    };
    checkUserStatus();
    window.appInited.value = true;
});

async function checkUserStatus() {
    try {
        let resp = await http.user.status();
        console.log("user_status:", resp);
        Object.assign(appConfigs.user, resp.data);
    } catch (ignored) {
    }
}

setInterval(checkUserStatus, appConfigs.user.checkIntervalTime);

</script>

<template>
    <RouterView />
</template>

<style>
html,
body,
div#app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

body {
    font-family: "MiSans Normal" !important;
    background-color: var(--color-bg-1);
}

@font-face {
    font-family: "MiSans Normal";
    src: url("fonts/MiSans-Normal.ttf");
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

body.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>

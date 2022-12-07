<script setup>
import { ref } from "vue";
import http from "./scripts/server-api.js";
import { useAppConfigs } from "./store/AppConfigsStore";

window.appInited = ref(false);
const appConfigs = useAppConfigs();

window.matchMedia("(prefers-color-scheme:dark)").onchange = event => {
    if (appConfigs.themeFollowSystem) {
        appConfigs.darkTheme = event.matches;
    }
};

(async () => {
    await checkUserStatus();
    window.appInited.value = true;
})();

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
@import url(./styles/box-shadow.css);

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
    color: var(--color-text-1);
}

@font-face {
    font-family: "MiSans Normal";
    src: url("fonts/MiSans-Normal.ttf");
}

body.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>

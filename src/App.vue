<script setup>
import { ref } from "vue";
import { http } from "./scripts/http";
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
        console.log("user_status:", resp.data);
        Object.assign(appConfigs.user, resp.data.data);
        appConfigs.appVersion = resp.headers["application-version"];
    } catch (ignored) {
    }
}

setInterval(checkUserStatus, appConfigs.user.checkIntervalTime);

</script>

<template>
    <RouterView />
</template>

<script setup>
import { ref } from "vue";
import { status as statusApi } from "./scripts/http/user-api";
import { useAppConfigs } from "./store/AppConfigsStore";
import { useUserStore } from "./store/UserStore";

window.appInited = ref(false);
useAppConfigs();
const userStore = useUserStore();

async function checkUserStatus() {
    try {
        const resp = await statusApi();
        console.log("user_status:", resp);
        Object.assign(userStore, resp.data);
    } catch (ignored) {
        userStore.admin = false;
        userStore.login = false;
    }
}

(async () => {
    await checkUserStatus();
    window.appInited.value = true;
})();

setInterval(checkUserStatus, userStore.checkIntervalTime);

</script>

<template>
    <RouterView />
</template>
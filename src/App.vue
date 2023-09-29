<script setup>
import { ref } from "vue";
import { http } from "./scripts/http";
import { useAppConfigs } from "./store/AppConfigsStore";
import { useUserStore } from "./store/UserStore";

window.appInited = ref(false);
useAppConfigs();
const userStore = useUserStore();

async function checkUserStatus() {
    try {
        let resp = await http.user.status();
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
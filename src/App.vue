<script setup>
import { ref } from "vue";
import { status as statusApi } from "./api/user-api";
import { getLogger } from "./plugins/logger";
import { useAppConfigs } from "./store/AppConfigsStore";
import { useUserStore } from "./store/UserStore";

const logger = getLogger(import.meta.filePath);

window.appInited = ref(false);
useAppConfigs();
const userStore = useUserStore();

async function checkUserStatus() {
    try {
        const resp = await statusApi();
        logger.set(import.meta.codeLineNum).info("user_status:", resp);
        Object.assign(userStore, resp);
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

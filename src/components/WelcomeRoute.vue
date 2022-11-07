<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { setThemeColor, sleep } from "/src/plugins/dsxPlugins";
import { useAppConfigs } from "/src/store/AppConfigsStore";

setThemeColor(window.getComputedStyle(document.body).backgroundColor);

const logo = ref((() => {
    let hour = new Date().getHours();
    if (7 <= hour && hour < 12) {
        return "Morning";
    } else if (12 <= hour && hour < 19) {
        return "Afternoon";
    } else {
        return "Evening";
    }
})());

const router = useRouter();
const appConfigs = useAppConfigs();

const unwatch = watchEffect(async () => {
    if (window.appInited.value) {
        let pushName = "login";
        if (appConfigs.user.login) {
            pushName = "index";
        }
        await sleep(400);
        await router.push({name: pushName});
        unwatch();
    }
});

</script>

<template>
    <div class="main">
        <div>
            <i class="fas fa-spider"></i>
            <p class="logo">
                Good<br />
                {{ logo }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.main {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.fa-spider {
    font-size: 20rem;
}

.logo {
    text-align: center;
    font-size: 3rem;
    font-weight: 900;
    font-family: system-ui;
    margin: 2rem 0;
}

body[arco-theme='dark'] .main {
    color: #fcfcfc;
}
</style>
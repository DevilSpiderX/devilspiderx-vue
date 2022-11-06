<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { setThemeColor, sleep } from "../plugins/dsxPlugins";
import http from "../scripts/server-api.js";

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

onMounted(async () => {
    let pushName;
    try {
        let resp = await http.user_status();
        console.log("user_status:", resp);
        let data = resp.data;
        if (data["login"] && data["status"] === 1) {
            pushName = "index";
        } else {
            pushName = "login";
        }
    } catch (error) {
        console.error("verify:", error);
        pushName = "login";
    }
    await sleep(400);
    await router.push({name: pushName});
});
</script>

<template>
    <div class="main">
        <div>
            <i class="fas fa-spider"></i>
            <p class="logo">
                Good<br/>
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
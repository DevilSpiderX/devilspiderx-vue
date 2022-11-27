<script setup>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useAppConfigs } from "@/store/AppConfigsStore";
import { sleep } from "@/util/util";

const appConfigs = useAppConfigs();
appConfigs.backgroundColor2StatusBarColor();

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

watchEffect(async () => {
    if (window.appInited.value) {
        let name = "login";
        if (appConfigs.user.login) {
            name = "index";
        }
        await sleep(400);
        router.push({ name });
    }
});

</script>

<template>
    <div class="main">
        <div>
            <i class="fas fa-spider" />
            <p class="logo">
                Good<br>
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
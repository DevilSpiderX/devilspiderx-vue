<script setup>
import faSpider from "@/assets/faSpider.svg";
import { useAppConfigs } from "@/store/AppConfigsStore";
import { useUserStore } from "@/store/UserStore";
import { sleep } from "@/util/util";
import { computed, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

const appConfigs = useAppConfigs();
const userStore = useUserStore();

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
        if (userStore.login) {
            name = "index";
        }
        await sleep(400);
        router.push({ name });
    }
});

const spiderImgFilter = computed(() => appConfigs.darkTheme ? "invert(100%)" : "");

</script>

<template>
    <div class="main">
        <div>
            <img class="spider-img" :src="faSpider" />
            <p class="logo">
                Good<br>
                {{ logo }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.spider-img {
    width: 20rem;
    height: 20rem;
    filter: v-bind(spiderImgFilter);
}

.logo {
    text-align: center;
    font-size: 3rem;
    font-weight: 900;
    font-family: system-ui;
    margin: 2rem 0;
}

body[arco-theme=dark] .main {
    color: #fcfcfc;
}
</style>
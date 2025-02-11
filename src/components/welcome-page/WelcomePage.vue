<script setup lang="ts">
import faSpider from "@/assets/faSpider.svg";
import { getLogger } from "@/plugins/logger.ts";
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
import { useUserStore } from "@/stores/UserStore.ts";
import { useWelcomePageStore } from "@/stores/WelcomePageStore.ts";
import { sleep } from "@/utils/util.ts";
import { isDefined } from "@/utils/validate.ts";
import { computed, onMounted, ref, useTemplateRef } from "vue";

const logger = getLogger(import.meta.filePath);

const emit = defineEmits<{
    over: [];
}>();

const appConfigs = useAppConfigs();
const userStore = useUserStore();
const welcomePageStore = useWelcomePageStore();
if (welcomePageStore.state) {
    emit("over");
}

const outerRef = useTemplateRef("outerRef");

const aniState = ref(false);

const logo = computed(() => {
    const hour = new Date().getHours();
    if (7 <= hour && hour < 12) {
        return "Morning";
    } else if (12 <= hour && hour < 19) {
        return "Afternoon";
    } else {
        return "Evening";
    }
});

const spiderImgFilter = computed(() => (appConfigs.darkTheme ? "invert(100%)" : ""));

onMounted(async () => {
    if (welcomePageStore.state) {
        return;
    }
    try {
        await userStore.checkUserStatus();
    } catch (error) {
        logger.set(import.meta.codeLineNum).error("获取用户状态出错", error);
    }
    await sleep(400);
    if (isDefined(outerRef.value)) {
        aniState.value = true;
        outerRef.value.addEventListener(
            "animationend",
            () => {
                emit("over");
                welcomePageStore.state = true;
            },
            {
                once: true,
            },
        );
    } else {
        emit("over");
        welcomePageStore.state = true;
    }
});
</script>

<template>
    <div class="main">
        <div
            ref="outerRef"
            :class="{ 'outer-animation': aniState }"
        >
            <img
                class="spider-img"
                :src="faSpider"
            />
            <p class="logo">
                Good<br />
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

body[arco-theme="dark"] .main {
    color: #fcfcfc;
}

@keyframes gradient-small {
    from {
        transform: scale(1);
    }

    to {
        transform: scale(0.01);
    }
}

.outer-animation {
    animation: gradient-small 300ms ease-in-out;
    animation-fill-mode: forwards;
}
</style>

<script setup lang="ts">
import faSpider from "@/assets/faSpider.svg";
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
import { useUserStore } from "@/stores/UserStore.ts";
import { sleep } from "@/utils/util.ts";
import { isDefined } from "@/utils/validate.ts";
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { useRouter } from "vue-router";

const appConfigs = useAppConfigs();
const userStore = useUserStore();

const logo = ref(
    (() => {
        const hour = new Date().getHours();
        if (7 <= hour && hour < 12) {
            return "Morning";
        } else if (12 <= hour && hour < 19) {
            return "Afternoon";
        } else {
            return "Evening";
        }
    })(),
);

const router = useRouter();

onMounted(async () => {
    await userStore.checkUserStatus();
    let name = "login";
    if (userStore.login) {
        name = "index";
    }
    await sleep(400);
    if (isDefined(outerRef.value)) {
        aniState.value = true;
        outerRef.value.addEventListener(
            "animationend",
            () => {
                router.push({ name });
            },
            {
                once: true,
            },
        );
    } else {
        router.push({ name });
    }
});

const spiderImgFilter = computed(() => (appConfigs.darkTheme ? "invert(100%)" : ""));

const outerRef = useTemplateRef("outerRef");
const aniState = ref(false);
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

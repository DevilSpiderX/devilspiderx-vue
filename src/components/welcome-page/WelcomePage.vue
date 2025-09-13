<script setup lang="ts">
import DsxFaSpider from "@/components/icon/DsxFaSpider.vue";
import { useWelcomePageStore } from "@/stores/WelcomePageStore";
import { sleep } from "@/utils/util.ts";
import { isDefined } from "@/utils/validate";
import { computed, onMounted, ref, useTemplateRef } from "vue";

const welcomePageStore = useWelcomePageStore();

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

onMounted(async () => {
    if (welcomePageStore.state) {
        return;
    }
    await sleep(500);
    if (isDefined(outerRef.value)) {
        aniState.value = true;
        outerRef.value.addEventListener(
            "animationend",
            () => {
                welcomePageStore.state = true;
            },
            {
                once: true,
            },
        );
    } else {
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
            <DsxFaSpider class="spider-img" />
            <p class="logo">
                Good<br />
                {{ logo }}
            </p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

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

    .spider-img {
        width: 20rem;
        height: 20rem;
    }

    .logo {
        text-align: center;
        font-size: 3rem;
        font-weight: 900;
        font-family: system-ui;
        margin: 2rem 0;
    }
}
</style>

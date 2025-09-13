<script setup lang="ts">
import { useAppStore } from "@/stores/App";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import WelcomePage from "./components/welcome-page/WelcomePage.vue";
import { useWelcomePageStore } from "./stores/WelcomePageStore.ts";

useAppStore();
const welcomePageStore = useWelcomePageStore();
</script>

<template>
    <ElConfigProvider :locale="zhCn">
        <RouterView v-if="welcomePageStore.state" />
        <WelcomePage v-else />
    </ElConfigProvider>
</template>

<style scoped lang="scss"></style>

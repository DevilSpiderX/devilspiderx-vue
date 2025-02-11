<script setup lang="ts">
import { useAppConfigs } from "@/stores/AppConfigsStore";
import WelcomePage from "./components/welcome-page/WelcomePage.vue";
import { useWelcomePageStore } from "./stores/WelcomePageStore.ts";

useAppConfigs();
const welcomePageStore = useWelcomePageStore();
</script>

<template>
    <RouterView v-if="welcomePageStore.state" />
    <WelcomePage v-else />
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/UserStore.ts";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

(async () => {
    await userStore.checkUserStatus();
    const name = userStore.login ? "index" : "login";
    router.push({ name });
})();
</script>

<template>
    <div />
</template>

<style scoped></style>

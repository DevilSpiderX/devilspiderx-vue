<script setup lang="ts">
import { useAppConfigs } from "@/stores/AppConfigsStore";

useAppConfigs();
</script>

<template>
    <RouterView />
</template>

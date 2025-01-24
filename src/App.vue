<script setup>
import { useAppConfigs } from "@/stores/AppConfigsStore";

useAppConfigs();
</script>

<template>
    <RouterView />
</template>

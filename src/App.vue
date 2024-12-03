<script setup>
import { useAppConfigs } from "./store/AppConfigsStore";

useAppConfigs();
</script>

<template>
    <RouterView />
</template>

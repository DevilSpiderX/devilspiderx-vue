<script setup>
import { useOnlineCount } from "./hooks/online-count";

const { onlineCount } = useOnlineCount();

</script>

<template>
    <RouterView :online-count="onlineCount" />
</template>
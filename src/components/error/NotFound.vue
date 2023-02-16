<script setup>
import { useAppConfigs } from "@/store/AppConfigsStore";
import { computed } from "vue";

const appConfigs = useAppConfigs();

const height30 = computed(() => {
    const height = appConfigs.client.height;
    if (height < 500) return 0;
    return height * 0.2;
});

</script>

<template>
    <div :style="{ paddingTop: height30 + 'px' }">
        <AResult status="404">
            <template #title>
                <h1>404</h1>
            </template>
            <template #subtitle>
                <p style="font-size: 1.3em">The requested URL {{ $route.path }} was not found on this server.</p>
            </template>
        </AResult>
    </div>
</template>
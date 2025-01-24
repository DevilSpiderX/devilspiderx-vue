<script setup>
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
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
            <template #icon>
                <img src="../../assets/404.svg" width="326" height="205" />
            </template>
            <template #title>
                <h1>&nbsp;</h1>
            </template>
            <template #subtitle>
                <p style="font-size: 1.3em">The requested URL <strong>{{ $route.path }}</strong> was not found on this
                    server.</p>
            </template>
        </AResult>
    </div>
</template>
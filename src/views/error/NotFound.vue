<script setup lang="ts">
import image404 from "@/assets/404.svg";
import { useAppStore } from "@/stores/App";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const appStore = useAppStore();

const height30 = computed(() => {
    const height = appStore.height;
    if (height < 500) return 0;
    return height * 0.2;
});

const route = useRoute();
const router = useRouter();

function onBackBtnClick() {
    router.push("/");
}
</script>

<template>
    <div :style="{ paddingTop: height30 + 'px' }">
        <ElResult title="404">
            <template #icon>
                <img
                    :src="image404"
                    width="326"
                    height="205"
                />
            </template>
            <template #sub-title>
                <p style="font-size: 1.3em">
                    The requested URL <strong>{{ route.path }}</strong> was not found on this server.
                </p>
            </template>
            <template #extra>
                <ElButton
                    type="primary"
                    @click="onBackBtnClick"
                >
                    Back
                </ElButton>
            </template>
        </ElResult>
    </div>
</template>

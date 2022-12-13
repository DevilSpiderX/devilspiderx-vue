<script setup>
import { useAppConfigs } from "@/store/AppConfigsStore";
import { Modal } from "@arco-design/web-vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const appConfigs = useAppConfigs();
appConfigs.statusBarColor = appConfigs.darkTheme ? "#17171a" : "#777a7f";

const router = useRouter();

onMounted(() => {
    Modal.info({
        title: "提示",
        content: "页面未完成",
        width: 300,
        okText: "返回",
        onBeforeClose: () => {
            router.back();
        }
    })
});

</script>

<template>
    <ALayout />
</template>

<style scoped>

</style>
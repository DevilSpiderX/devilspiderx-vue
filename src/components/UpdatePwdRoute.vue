<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { Modal } from "@arco-design/web-vue";
import { useAppConfigs } from "@/store/AppConfigsStore";

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
    <a-layout />
</template>

<style scoped>

</style>
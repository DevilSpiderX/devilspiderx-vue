<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { Modal } from "@arco-design/web-vue";
import { useAppConfigs } from "/src/store/AppConfigsStore";

const appConfigs = useAppConfigs();
appConfigs.statusBarColor = appConfigs.darkTheme ? "#17171a" : "#777a7f";

const router = useRouter();

onMounted(() => {
    Modal.info({
        title: "提示",
        content: "页面未完成",
        width: 300,
        okText: "旧页面",
        cancelText: "返回",
        hideCancel: false,
        maskClosable: false,
        onOk: () => {
            window.open("/log.html", "_self");
        },
        onCancel: () => {
            router.back();
        }
    });
});

</script>

<template>
    <a-layout />
</template>

<style scoped>

</style>
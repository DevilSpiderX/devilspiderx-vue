<script setup>
import { inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Modal } from "@arco-design/web-vue";
import { setThemeColor } from "../plugins/myPlugins.js";

const appSettings = inject("appSettings");
setThemeColor(appSettings.darkTheme ? "#17171a" : "#777a7f");

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
    <a-layout>
    </a-layout>
</template>

<style scoped>

</style>
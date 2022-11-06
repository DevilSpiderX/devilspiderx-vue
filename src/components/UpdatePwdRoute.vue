<script setup>
import { inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Modal } from "@arco-design/web-vue";
import { setThemeColor } from "../plugins/dsxPlugins";

const appSettings = inject("appSettings");
setThemeColor(appSettings.darkTheme ? "#17171a" : "#777a7f");

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
    <a-layout>
    </a-layout>
</template>

<style scoped>

</style>
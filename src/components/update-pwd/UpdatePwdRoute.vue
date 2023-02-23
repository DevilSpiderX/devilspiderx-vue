<script setup>
import { Modal } from "@arco-design/web-vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
    Modal.info({
        title: "提示",
        content: "页面未完成",
        width: 300,
        okText: "返回",
        onBeforeClose: () => {
            router.push({ name: 'index' });
        }
    })
});

</script>

<template>
    <ALayout />
</template>

<style scoped></style>
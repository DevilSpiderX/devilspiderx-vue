<template>
    <a-layout>
    </a-layout>
</template>

<script>
import {Modal} from "@arco-design/web-vue";

export default {
    name: "LogRoute",
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {
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
            onCancel: function () {
                this.$router.back();
            }.bind(this)
        });
    }
}
</script>

<style scoped>

</style>
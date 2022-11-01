<template>
    <a-layout>
    </a-layout>
</template>

<script>
import {Modal} from "@arco-design/web-vue";

export default {
    name: "UpdatePwdRoute",
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {
        Modal.info({
            title: "提示",
            content: "页面未完成",
            width: 300,
            okText: "返回",
            onBeforeClose: function () {
                this.$router.back();
            }.bind(this)
        })
    }
}
</script>
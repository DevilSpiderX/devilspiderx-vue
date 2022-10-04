<template>
    <el-container>
    </el-container>
</template>

<script>
import {ElMessageBox} from "element-plus";

export default {
    name: "LogRoute",
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {
        ElMessageBox.alert("页面未完成", "提示", {
            autofocus: false,
            type: "warning ",
            confirmButtonText: "旧页面",
            cancelButtonText: "返回",
            showCancelButton: true,
            callback: function (action) {
                if (action === "confirm") {
                    window.open("/log.html", "_self");
                } else {
                    this.$router.back();
                }
            }.bind(this)
        });
    }
}
</script>

<style scoped>

</style>
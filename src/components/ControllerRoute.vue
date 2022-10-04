<template>
    <el-container>
    </el-container>
</template>

<script>
import {ElMessageBox} from "element-plus";

export default {
    name: "ControllerRoute",
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
                    window.open("/controller.html", "_self");
                } else {
                    this.$router.back();
                }
            }.bind(this)
        });
    }
}
</script>

<style scoped src="../css/nav-back-button.css"></style>

<style scoped>

</style>
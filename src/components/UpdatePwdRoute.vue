<template>
    <el-container>
    </el-container>
</template>

<script>
import {ElMessageBox} from "element-plus";

export default {
    name: "UpdatePwdRoute",
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {
        ElMessageBox.alert("页面未完成", "提示", {
            autofocus: false,
            type: "warning ",
            cancelButtonText: "返回",
            showCancelButton: true,
            showConfirmButton: false,
            callback: function () {
                this.$router.back();
            }.bind(this)
        });
    }
}
</script>
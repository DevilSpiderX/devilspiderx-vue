<template>
    <el-container>
    </el-container>
</template>

<script>
import {setThemeColor} from "@/js/global";
import {ElMessageBox} from "element-plus";

export default {
    name: "UpdatePwdRoute",
    beforeMount() {
        setThemeColor("#FFFFFF");
    }, mounted() {
        let vm = this;
        ElMessageBox.alert("页面未完成", "提示", {
            autofocus: false,
            type: "warning ",
            confirmButtonText: "返回",
            callback: function () {
                vm.$router.back();
            }
        });
    }
}
</script>
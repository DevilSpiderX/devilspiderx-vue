<template>
    <!-- 导航栏 -->
    <nav class="navbar navbar-expand-md bg-dark navbar-dark">
        <a href="javascript:void(0)" @click="this.$router.back()" class="nav-back-button">
            <i class="fas fa-arrow-left" style="font-size: 1.2rem;"></i>
        </a>
        <!-- 导航栏LOGO -->
        <a class="navbar-brand font-weight-bold">DevilSpiderX</a>

        <!-- 自适应弹出按钮 -->
        <button class="navbar-toggler" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 导航栏菜单 -->
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
            <ul class="navbar-nav">
                <li class="nav-item"></li>
            </ul>
        </div>
    </nav>

    <!-- 主体 -->
    <div class="container">
        <h1>updatePwd.html未完成</h1>
    </div>
</template>

<script>
import {setThemeColor} from "@/js/global";

export default {
    name: "updatePwd",
    beforeMount() {
        setThemeColor("#343A40");
    }
}
</script>

<style scoped src="../css/nav-back-button.css"></style>
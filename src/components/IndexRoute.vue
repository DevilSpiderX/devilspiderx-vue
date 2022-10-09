<template>
    <el-container>
        <el-header style="border-bottom: 1px solid #84858d55;">
            <el-page-header title=" " @back="el_header_back">
                <template #icon>
                    <i class="fa-solid fa-bars fa-fw" style="font-size: 1.2rem;"></i>
                </template>
                <template #content>
                    <span style="font-weight:700;"> DevilSpiderX </span>
                </template>
            </el-page-header>
        </el-header>
        <el-main style="padding:20px 15px;">
            <el-row justify="center">
                <el-col :sm="16" :md="14" :lg="11" :xl="12" ref="test">
                    <el-button class="my-button" @contextmenu.prevent.stop
                               @click="this.$router.push({name:'controller'})">
                        <template #icon>
                            <i class="fas fa-sliders-h fa-fw"></i>
                        </template>
                        控制中心
                    </el-button>
                    <el-button class="my-button" @contextmenu.prevent.stop
                               @click="this.$router.push({name:'query'})">
                        <template #icon>
                            <i class="fas fa-search fa-fw"></i>
                        </template>
                        查&nbsp;&nbsp;询
                    </el-button>
                    <el-button class="my-button" @contextmenu.prevent.stop
                               @click="this.$router.push({name:'v2ray'})">
                        <template #icon>
                            <!--suppress CheckImageSize -->
                            <img src="/src/assets/v2rayN.png" alt="v2ray" width="27" height="27">
                        </template>
                        V2Ray
                    </el-button>
                    <el-button class="my-button" @contextmenu.prevent.stop
                               @click="this.$router.push({name:'log'})">
                        <template #icon>
                            <i class="fas fa-file-alt fa-fw"></i>
                        </template>
                        日&nbsp;&nbsp;志
                    </el-button>
                    <el-button class="my-button" @contextmenu.prevent.stop
                               @click="this.$router.push({name:'updatePwd'})">
                        <template #icon>
                            <i class="fas fa-edit fa-fw"></i>
                        </template>
                        修改密码
                    </el-button>
                    <el-button class="my-button" @contextmenu.prevent.stop
                               @click="on_logoutButton_clicked">
                        <template #icon>
                            <i class="fas fa-sign-out-alt fa-fw"></i>
                        </template>
                        退出登录
                    </el-button>
                    <el-button class="my-button" @contextmenu.prevent.stop
                               @click="on_exit_clicked">
                        <template #icon>
                            <i class="fas fa-power-off fa-fw"></i>
                        </template>
                        退&nbsp;&nbsp;出
                    </el-button>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import {logout} from "/src/js/server-api";
import {ElMessage} from "element-plus";

export default {
    name: "IndexRoute",
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {
    },
    methods: {
        el_header_back() {
            ElMessage.error("未完成");
        },
        on_logoutButton_clicked() {
            logout(function (resp) {
                switch (resp["code"]) {
                    case 0: {
                        sessionStorage.setItem("user_status", "0");
                        ElMessage.success("登出成功");
                        break;
                    }
                    case 1: {
                        ElMessage.error("您还未登录过");
                        break;
                    }
                }
                this.$router.push({name: "login"});
            }.bind(this), function () {
                ElMessage.error("服务器错误");
            });
        },
        on_exit_clicked() {
            window.open("about:blank", "_self").close();
        },

    }
}
</script>

<style scoped>

@media (max-width: 768px) {
    /*noinspection CssUnusedSymbol*/
    .el-col-24 {
        max-width: 470px;
    }
}

.my-button {
    --el-button-text-color: #000000;
    --el-button-bg-color: #ffffff;
    width: 100%;
    padding: 0.7rem 1.2rem;
    font-size: 1.5rem;
    font-family: MiSans-Regular, serif;
    line-height: 1.5;
    margin: 0 0 24px 0;
    height: 60px;
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15);
}

.my-button:focus,
.my-button:hover {
    --el-button-hover-text-color: #fff;
    --el-button-hover-bg-color: #343a40;
    --el-button-hover-border-color: #343a40;
}

.my-button:last-child {
    --el-button-text-color: #ffffff;
    --el-button-bg-color: #dc3545;
    --el-button-border-color: #dc3545;
}

.my-button:last-child:focus,
.my-button:last-child:hover {
    --el-button-hover-bg-color: #c82333;
    --el-button-hover-border-color: #c82333;
}

.my-button:hover img {
    filter: invert(100%);
}
</style>
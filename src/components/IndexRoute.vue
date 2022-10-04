<template>
    <el-container>
        <el-header style="border-bottom: 1px solid #84858d55;">
            <el-page-header title=" " @back="this.$router.back()">
                <template #icon>
                    <i class="fas fa-arrow-left fa-fw" style="font-size: 1.2rem;"></i>
                </template>
                <template #content>
                    <span style="font-weight:700;"> DevilSpiderX </span>
                </template>
            </el-page-header>
        </el-header>
        <el-main style="padding:20px 15px;">
            <el-row justify="center">
                <el-col :sm="16" :md="14" :lg="11" :xl="12" ref="test">
                    <el-button class="my-button" style="width: 100%" @contextmenu.prevent.stop
                               @click="this.$router.push({name:'controller'})">
                        <template #icon>
                            <i class="fas fa-sliders-h fa-fw"></i>
                        </template>
                        控制中心
                    </el-button>
                    <el-button class="my-button" style="width: 100%" @contextmenu.prevent.stop
                               @click="this.$router.push({name:'query'})">
                        <template #icon>
                            <i class="fas fa-search fa-fw"></i>
                        </template>
                        查&nbsp;&nbsp;询
                    </el-button>
                    <el-button class="my-button" style="width: 100%" @contextmenu.prevent.stop
                               @click="this.$router.push({name:'v2ray'})">
                        <template #icon>
                            <!--suppress CheckImageSize -->
                            <img src="@/assets/v2rayN.png" alt="v2ray" width="27" height="27">
                        </template>
                        V2Ray
                    </el-button>
                    <el-button class="my-button" style="width: 100%" @contextmenu.prevent.stop
                               @click="this.$router.push({name:'log'})">
                        <template #icon>
                            <i class="fas fa-file-alt fa-fw"></i>
                        </template>
                        日&nbsp;&nbsp;志
                    </el-button>
                    <el-button class="my-button" style="width: 100%" @contextmenu.prevent.stop
                               @click="this.$router.push({name:'updatePwd'})">
                        <template #icon>
                            <i class="fas fa-edit fa-fw"></i>
                        </template>
                        修改密码
                    </el-button>
                    <el-button class="my-button" style="width: 100%" @contextmenu.prevent.stop
                               @click="on_logoutButton_clicked">
                        <template #icon>
                            <i class="fas fa-sign-out-alt fa-fw"></i>
                        </template>
                        退出登录
                    </el-button>
                    <el-button class="my-button" style="width: 100%" @contextmenu.prevent.stop
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
import {logout} from "@/js/server-api";

export default {
    name: "IndexRoute",
    methods: {
        on_logoutButton_clicked() {
            logout(function (resp) {
                switch (resp["code"]) {
                    case 0: {
                        sessionStorage.setItem("user_status", "0");
                        break;
                    }
                    case 1: {
                        alert("您还未登录过");
                        break;
                    }
                }
                this.$router.push({name: "login"});
            }.bind(this));
        },
        on_exit_clicked() {
            window.open("about:blank", "_self").close();
        }
    },
    beforeMount() {
        this.setThemeColor("#dcdcdc");
    },
    mounted() {
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
    padding: 0.7rem 1.2rem;
    font-size: 1.5rem;
    line-height: 1.5;
    margin: 0 0 24px 0;
    color: black;
    height: 60px;
    box-shadow: var(--el-box-shadow);
}

.my-button:hover {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40;
}

.my-button:last-child {
    color: white;
    background-color: #dc3545;
    border-color: #dc3545;
}

.my-button:last-child:hover {
    background-color: #c82333;
    border-color: #c82333;
}

.my-button:last-child:focus {
    background-color: #c82333;
    border-color: #c82333;
}

.my-button:hover img {
    filter: invert(100%);
}
</style>
<template>
    <a-layout>
        <a-layout-header style="border-bottom: 1px solid #84858d55;">
            <a-page-header @back="header_back">
                <template #back-icon>
                    <i class="fa-solid fa-bars fa-fw" style="font-size: 1.2rem;"></i>
                </template>
                <template #title>
                    <span style="font-weight:700;"> DevilSpiderX </span>
                </template>
            </a-page-header>
        </a-layout-header>
        <a-layout-content style="padding:20px 15px;">
            <a-row justify="center">
                <a-col :xs="24" :sm="21" :md="16" :lg="14" :xl="12" :xxl="10">
                    <a-space direction="vertical" fill size="large">
                        <a-button class="my-button" @contextmenu.prevent.stop
                                  @click="this.$router.push({name:'controller'})">
                            <template #icon>
                                <i class="fas fa-sliders-h fa-fw"></i>
                            </template>
                            控制中心
                        </a-button>
                        <a-button class="my-button" @contextmenu.prevent.stop
                                  @click="this.$router.push({name:'query'})">
                            <template #icon>
                                <i class="fas fa-search fa-fw"></i>
                            </template>
                            查&nbsp;&nbsp;询
                        </a-button>
                        <a-button class="my-button" @contextmenu.prevent.stop
                                  @click="this.$router.push({name:'v2ray'})">
                            <template #icon>
                                <!--suppress CheckImageSize -->
                                <img src="/src/assets/v2rayN.png" alt="v2ray" width="27" height="27"
                                     style="transform: translateY(4px);">
                            </template>
                            V2Ray
                        </a-button>
                        <a-button class="my-button" @contextmenu.prevent.stop
                                  @click="this.$router.push({name:'log'})">
                            <template #icon>
                                <i class="fas fa-file-alt fa-fw"></i>
                            </template>
                            日&nbsp;&nbsp;志
                        </a-button>
                        <a-button class="my-button" @contextmenu.prevent.stop
                                  @click="this.$router.push({name:'updatePwd'})">
                            <template #icon>
                                <i class="fas fa-edit fa-fw"></i>
                            </template>
                            修改密码
                        </a-button>
                        <a-button class="my-button" @contextmenu.prevent.stop @click="on_logoutButton_clicked">
                            <template #icon>
                                <i class="fas fa-sign-out-alt fa-fw"></i>
                            </template>
                            退出登录
                        </a-button>
                        <a-button class="my-button exit-button" @contextmenu.prevent.stop @click="on_exit_clicked">
                            <template #icon>
                                <i class="fas fa-power-off fa-fw"></i>
                            </template>
                            退&nbsp;&nbsp;出
                        </a-button>
                    </a-space>
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>
</template>

<script>
import {logout} from "/src/scripts/server-api.js";
import {Message, Notification} from '@arco-design/web-vue';

export default {
    name: "IndexRoute",
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {
    },
    methods: {
        header_back() {
            Message.error("未完成");
        },
        on_logoutButton_clicked() {
            logout(function (resp) {
                switch (resp["code"]) {
                    case 0: {
                        sessionStorage.setItem("user_status", "0");
                        Notification.success("登出成功");
                        break;
                    }
                    case 1: {
                        Notification.error("您还未登录过");
                        break;
                    }
                }
                this.$router.push({name: "login"});
            }.bind(this), function () {
                Notification.error("服务器错误");
            });
        },
        on_exit_clicked() {
            window.open("about:blank", "_self").close();
        },

    }
}
</script>

<style scoped>
.my-button {
    --color-text-2: var(--color-text-1);
    --color-secondary: var(--color-bg-1);
    --border-color: #dcdfe6;
    border-color: var(--border-color);
    width: 100%;
    padding: 0.7rem 1.2rem;
    font-size: 1.5rem;
    font-family: MiSans-Normal, system-ui;
    line-height: 1.5;
    height: 60px;
    box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15);
}

.my-button:focus,
.my-button:hover {
    --color-text-2: #fff;
    --color-secondary-hover: #343a40;
    --border-color-hover: #343a40;
    background-color: var(--color-secondary-hover);
    border-color: var(--border-color-hover);
}

.my-button.exit-button {
    --color-text-2: #fff;
    --color-secondary: #dc3545;
    --border-color: #dc3545;
}

.my-button.exit-button:focus,
.my-button.exit-button:hover {
    --color-secondary-hover: #c82333;
    --border-color-hover: #c82333;
}

.my-button:hover img {
    filter: invert(100%);
}

/*深色模式*/
body[arco-theme='dark'] .my-button {
    --color-secondary: rgba(var(--gray-9), .08);
    --border-color: rgba(var(--gray-9), .1);
}

body[arco-theme='dark'] .my-button.exit-button {
    --color-secondary: #c82333;
    --border-color: #c82333;
}

body[arco-theme='dark'] .my-button.exit-button:focus,
body[arco-theme='dark'] .my-button.exit-button:hover {
    --color-secondary-hover: #dc3545;
    --border-color-hover: #dc3545;
}

body[arco-theme='dark'] .my-button img {
    filter: invert(100%);
}
</style>
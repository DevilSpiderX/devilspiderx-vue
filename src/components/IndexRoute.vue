<script setup>
import { reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { IconClose, IconMoonFill, IconSunFill } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import http from "@/scripts/server-api";
import { useAppConfigs } from "@/store/AppConfigsStore";

const appConfigs = useAppConfigs();
appConfigs.statusBarColor = window.getComputedStyle(document.body).backgroundColor;

const drawer = reactive({
    visible: false,
    empty_form: {}
});

watch(() => appConfigs.darkTheme, newVal => appConfigs.statusBarColor = newVal && drawer.visible ?
    "#2a2a2b" : window.getComputedStyle(document.body).backgroundColor
);

watch(() => drawer.visible, newVal => appConfigs.statusBarColor = newVal && appConfigs.darkTheme ?
    "#2a2a2b" : window.getComputedStyle(document.body).backgroundColor
);

const router = useRouter();

async function on_logoutButton_clicked() {
    try {
        let resp = await http.user.logout();
        console.log("Logout:", resp);
        switch (resp["code"]) {
            case 0: {
                appConfigs.user.login = false;
                Message.success("登出成功");
                break;
            }
            case 1: {
                Message.error("您还未登录过");
                break;
            }
        }
        router.push({ name: "login" });
    } catch (error) {
        console.error("(on_logoutButton_clicked)", `url:${error.config?.url}`, error);
        Message.error("服务器错误");
    }
}

function on_exit_clicked() {
    window.open("about:blank", "_self").close();
}

</script>

<template>
    <a-layout>
        <a-layout-header style="border-bottom: 1px solid #84858d55;">
            <a-page-header @back="drawer.visible = true">
                <template #back-icon>
                    <span style="font-size: 1.2rem;position: relative">
                        <i class="fa-solid fa-bars fa-fw" />
                    </span>
                </template>
                <template #title>
                    <span> DevilSpiderX </span>
                </template>
                <template #extra>
                    <a-switch v-model="appConfigs.darkTheme" :disabled="appConfigs.themeFollowSystem"
                        checked-color="#2f2f2f">
                        <template #unchecked-icon>
                            <span style="color: var(--color-text-3)">
                                <icon-sun-fill />
                            </span>
                        </template>
                        <template #checked-icon>
                            <span style="color: #2f2f2f">
                                <icon-moon-fill />
                            </span>
                        </template>
                    </a-switch>
                </template>
            </a-page-header>
        </a-layout-header>
        <a-layout-content style="padding:20px 15px;">
            <a-row justify="center">
                <a-col :xs="24" :sm="21" :md="16" :lg="14" :xl="12" :xxl="10">
                    <a-space direction="vertical" fill size="large">
                        <a-button class="my-button" long @contextmenu.prevent.stop
                            @click="$router.push({ name: 'controller' })">
                            <template #icon>
                                <i class="fas fa-sliders-h fa-fw" />
                            </template>
                            控制中心
                        </a-button>
                        <a-button class="my-button" long @contextmenu.prevent.stop
                            @click="$router.push({ name: 'query' })">
                            <template #icon>
                                <i class="fas fa-search fa-fw" />
                            </template>
                            查&nbsp;&nbsp;询
                        </a-button>
                        <a-button class="my-button" long @contextmenu.prevent.stop
                            @click="$router.push({ name: 'v2ray' })">
                            <template #icon>
                                <!--suppress CheckImageSize -->
                                <img src="@/assets/v2rayN.png" alt="v2ray" width="27" height="27"
                                    style="transform: translateY(4px);">
                            </template>
                            V2Ray
                        </a-button>
                        <a-button v-if="appConfigs.user.admin" class="my-button" long @contextmenu.prevent.stop
                            @click="$router.push({ name: 'log' })">
                            <template #icon>
                                <i class="fas fa-file-alt fa-fw" />
                            </template>
                            日&nbsp;&nbsp;志
                        </a-button>
                        <a-button class="my-button" long @contextmenu.prevent.stop
                            @click="$router.push({ name: 'updatePwd' })">
                            <template #icon>
                                <i class="fas fa-edit fa-fw" />
                            </template>
                            修改密码
                        </a-button>
                        <a-button class="my-button" long @contextmenu.prevent.stop @click="on_logoutButton_clicked">
                            <template #icon>
                                <i class="fas fa-sign-out-alt fa-fw" />
                            </template>
                            退出登录
                        </a-button>
                        <a-button class="my-button exit-button" long @contextmenu.prevent.stop @click="on_exit_clicked">
                            <template #icon>
                                <i class="fas fa-power-off fa-fw" />
                            </template>
                            退&nbsp;&nbsp;出
                        </a-button>
                    </a-space>
                </a-col>
            </a-row>
        </a-layout-content>
    </a-layout>
    <a-drawer v-model:visible="drawer.visible" placement="left" :footer="false">
        <template #header>
            <a-row justify="space-between" style="width: 100%;">
                <h2 style="margin: 0;color: var(--color-text-1)">
                    设置
                </h2>
                <a-button class="drawer-close-button" shape="circle" size="small" @click="drawer.visible = false">
                    <template #icon>
                        <icon-close />
                    </template>
                </a-button>
            </a-row>
        </template>
        <a-form :model="drawer.empty_form" auto-label-width>
            <a-form-item label="深色模式">
                <a-switch v-model="appConfigs.darkTheme" :disabled="appConfigs.themeFollowSystem" />
            </a-form-item>
            <a-form-item label="主题跟随系统">
                <a-switch v-model="appConfigs.themeFollowSystem" />
            </a-form-item>
        </a-form>
    </a-drawer>
</template>

<style scoped>
.my-button {
    --color-text-2: var(--color-text-1);
    --color-secondary: var(--color-bg-1);
    --border-color: #dcdfe6;
    border-color: var(--border-color);
    border-radius: var(--border-radius-large);
    padding: 0.7rem 1.2rem;
    font-size: 1.5rem;
    font-family: "MiSans Normal", system-ui;
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

.drawer-close-button {
    --color-secondary: #0000;
}
</style>
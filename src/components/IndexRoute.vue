<script setup lang="jsx">
import { computed, isVNode, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { IconClose, IconMoonFill, IconSunFill } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import { DSXMenuIcon as Icon } from "./dsx-menu";
import v2rayNPngUrl from "@/assets/v2rayN.png";
import { useAppConfigs } from "@/store/AppConfigsStore";
import http from "@/scripts/server-api";

const appConfigs = useAppConfigs();
appConfigs.backgroundColor2StatusBarColor();

const router = useRouter();

const buttonList = reactive([
    {
        label: "控制中心",
        icon: (<i class="fas fa-sliders-h fa-fw" />),
        onClick: () => { router.push({ name: 'controller' }) }
    },
    {
        label: "密码查询",
        icon: (<i class="fas fa-search fa-fw" />),
        onClick: () => { router.push({ name: 'query' }) }
    },
    {
        label: "V2Ray",
        icon: (<img src={v2rayNPngUrl} alt="v2ray" width="27" height="27" style="transform: translateY(4px)" />),
        onClick: () => { router.push({ name: 'v2ray' }) }
    },
    {
        label: "日\u00a0\u00a0志",
        icon: (<i class="fas fa-file-alt fa-fw" />),
        onClick: () => { router.push({ name: 'log' }) },
        hidden: computed(() => !appConfigs.user.admin)
    },
    {
        label: "修改密码",
        icon: (<i class="fas fa-edit fa-fw" />),
        onClick: () => { router.push({ name: 'updatePwd' }) },
    },
    {
        label: "退出登录",
        icon: (<i class="fas fa-sign-out-alt fa-fw" />),
        onClick: on_logoutButton_clicked
    },
    {
        class: ["exit-button"],
        label: " 退\u00a0\u00a0出",
        icon: (<i class="fas fa-power-off fa-fw" />),
        onClick: on_exit_clicked
    }
]);

const drawer = reactive({
    visible: false,
    empty_form: {}
});

watch(() => appConfigs.darkTheme, darkTheme => appConfigs.statusBarColor = darkTheme && drawer.visible ?
    "#2a2a2b" : window.getComputedStyle(document.body).backgroundColor
);

watch(() => drawer.visible, visible => appConfigs.statusBarColor = visible && appConfigs.darkTheme ?
    "#2a2a2b" : window.getComputedStyle(document.body).backgroundColor
);

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
    <ALayout>
        <ALayoutHeader>
            <APageHeader @back="drawer.visible = true">
                <template #back-icon>
                    <span style="font-size: 1.2rem;position: relative">
                        <i class="fa-solid fa-bars fa-fw" />
                    </span>
                </template>
                <template #title>
                    <span> DevilSpiderX </span>
                </template>
                <template #extra>
                    <ASwitch v-model="appConfigs.darkTheme" :disabled="appConfigs.themeFollowSystem"
                        checked-color="#2f2f2f">
                        <template #unchecked-icon>
                            <span style="color: var(--color-text-3)">
                                <IconSunFill />
                            </span>
                        </template>
                        <template #checked-icon>
                            <span style="color: #2f2f2f">
                                <IconMoonFill />
                            </span>
                        </template>
                    </ASwitch>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent style="padding:20px 15px;">
            <ARow justify="center">
                <ACol :xs="24" :sm="21" :md="16" :lg="14" :xl="12" :xxl="10">
                    <ASpace direction="vertical" fill size="large">
                        <template v-for="(btn, index) in buttonList">
                            <AButton v-if="!btn.hidden" class="my-button" :class="btn.class" long :key="index"
                                @contextmenu.prevent.stop @click="btn.onClick">
                                <template #icon v-if="btn.icon">
                                    <Icon :icon="btn.icon" />
                                </template>
                                {{ btn.label }}
                            </AButton>
                        </template>
                    </ASpace>
                </ACol>
            </ARow>
        </ALayoutContent>
    </ALayout>
    <ADrawer v-model:visible="drawer.visible" placement="left" :footer="false">
        <template #header>
            <ARow justify="space-between" style="width: 100%;">
                <h2 style="margin: 0">
                    设置
                </h2>
                <AButton class="drawer-close-button" shape="circle" size="small" @click="drawer.visible = false">
                    <template #icon>
                        <IconClose />
                    </template>
                </AButton>
            </ARow>
        </template>
        <AForm :model="drawer.empty_form" auto-label-width>
            <AFormItem label="深色模式">
                <ASwitch v-model="appConfigs.darkTheme" :disabled="appConfigs.themeFollowSystem" />
            </AFormItem>
            <AFormItem label="主题跟随系统">
                <ASwitch v-model="appConfigs.themeFollowSystem" />
            </AFormItem>
        </AForm>
    </ADrawer>
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

.my-button:focus :deep(img),
.my-button:hover :deep(img) {
    filter: invert(100%);
}

/*深色模式*/
body[arco-theme=dark] .my-button {
    --color-secondary: rgba(var(--gray-9), .08);
    --border-color: rgba(var(--gray-9), .1);
}

body[arco-theme=dark] .my-button.exit-button {
    --color-secondary: #c82333;
    --border-color: #c82333;
}

body[arco-theme=dark] .my-button.exit-button:focus,
body[arco-theme=dark] .my-button.exit-button:hover {
    --color-secondary-hover: #dc3545;
    --border-color-hover: #dc3545;
}

body[arco-theme=dark] .my-button :deep(img) {
    filter: invert(100%);
}

.drawer-close-button {
    --color-secondary: #0000;
}
</style>
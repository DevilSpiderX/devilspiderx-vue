<script setup lang="jsx">
import { getAvatar as getAvatarApi, logout as logoutApi, uploadAvatar as uploadAvatarApi } from "@/api/user-api.ts";
import v2rayNPngUrl from "@/assets/v2rayN.png";
import { DSXMenuIcon as Icon } from "@/components/dsx-menu/index.ts";
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
import { useUserStore } from "@/stores/UserStore.ts";
import { Scrollbar as AScrollbar, Message } from "@arco-design/web-vue";
import { IconMoonFill, IconSunFill } from "@arco-design/web-vue/es/icon";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import UpdatePwdModal from "./components/UpdatePwdModal.vue";

const appConfigs = useAppConfigs(),
    userStore = useUserStore(),
    router = useRouter();

const buttonList = ref([
    {
        label: "控制中心",
        icon: <i class="fa-solid fa-sliders"></i>,
        onClick: () => {
            router.push({ name: "controller" });
        },
    },
    {
        label: "密码查询",
        icon: <i class="fa-solid fa-magnifying-glass"></i>,
        onClick: () => {
            router.push({ name: "query" });
        },
    },
    {
        label: "V2Ray",
        icon: (
            <i class="fa-solid">
                <img
                    src={v2rayNPngUrl}
                    alt="v2ray"
                    width="27"
                    height="27"
                    style="transform: translateY(4px)"
                />
            </i>
        ),
        onClick: () => {
            router.push({ name: "v2ray" });
        },
    },
    {
        label: "日\u00a0\u00a0志",
        icon: <i class="fa-solid fa-file-lines"></i>,
        onClick: () => {
            router.push({ name: "log" });
        },
        hidden: computed(() => !userStore.admin),
    },
    {
        label: "ANi番剧",
        icon: <i class="fa-brands fa-youtube"></i>,
        onClick: () => {
            router.push({ name: "ANi" });
        },
    },
    {
        label: "手续费计算器",
        icon: <i class="fa-solid fa-calculator"></i>,
        onClick: () => {
            router.push({ name: "fjrc_fee_calculator" });
        },
    },
    {
        class: ["exit-button"],
        label: " 退\u00a0\u00a0出",
        icon: <i class="fa-solid fa-power-off"></i>,
        onClick: on_exit_clicked,
    },
]);

const drawer = ref({
    visible: false,
    empty_form: {},
});

async function on_logoutButton_clicked() {
    try {
        await logoutApi();
        userStore.$reset();
        Message.success("登出成功");
        router.push({ name: "login" });
    } catch (error) {
        logger.set(import.meta.codeLineNum).error(`url:${error.config?.url}`, error);
        Message.error("登出失败");
    }
}

function on_exit_clicked() {
    window.open("about:blank", "_self").close();
}

const avatarSrc = computed({
    get: () => userStore.avatar,
    set: newAvatar => (userStore.avatar = newAvatar),
});

if (avatarSrc.value === undefined) {
    getAvatarApi()
        .then(resp => (avatarSrc.value = resp))
        .catch(() => {
            avatarSrc.value = undefined;
        });
}

function on_avatar_error() {
    avatarSrc.value = undefined;
}

function on_avatar_dblclick() {
    if (avatarSrc.value) {
        avatarPreview.value.visible = true;
    }
}

function on_upload_avatar_button_click() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/png";
    fileInput.addEventListener("change", on_avatar_file_input_change, { once: true });
    fileInput.click();
}

async function on_avatar_file_input_change(ev) {
    const files = ev.target.files;
    if (files.length > 0) {
        const resp = await uploadAvatarApi(files.item(0));
        Message.success("修改成功");
        avatarSrc.value = `${resp.avatar}?time=${new Date().getTime()}`;
    }
}

const updatePwdModal = ref({
    visible: false,
});

const avatarPreview = ref({
    visible: false,
    actions: ["zoomIn", "originalSize", "zoomOut"],
});
</script>

<template>
    <AScrollbar
        class="fill-scrollbar"
        outer-class="fill-scrollbar-out"
    >
        <ALayout>
            <ALayoutHeader>
                <APageHeader @back="drawer.visible = true">
                    <template #back-icon>
                        <span style="font-size: 1.2rem; position: relative">
                            <i class="fa-solid fa-bars" />
                        </span>
                    </template>
                    <template #title>
                        <span>
                            DevilSpiderX
                            <ATag
                                color="arcoblue"
                                size="small"
                            >
                                v{{ appConfigs.appVersion }}
                            </ATag>
                        </span>
                    </template>
                    <template #extra>
                        <ASpace>
                            <ASwitch
                                v-model="appConfigs.darkTheme"
                                :disabled="appConfigs.themeFollowSystem"
                                checked-color="#2f2f2f"
                            >
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
                            <ADropdown
                                trigger="hover"
                                position="br"
                            >
                                <AAvatar
                                    v-if="avatarSrc"
                                    style="cursor: pointer"
                                    :image-url="avatarSrc"
                                    @error="on_avatar_error"
                                    @dblclick="on_avatar_dblclick"
                                />
                                <AAvatar
                                    v-else
                                    style="cursor: pointer"
                                >
                                    <i class="fa-solid fa-user"></i>
                                </AAvatar>
                                <template #content>
                                    <a-doption @click="on_upload_avatar_button_click">
                                        设置头像
                                        <template #icon>
                                            <i class="fa-solid fa-camera"></i>
                                        </template>
                                    </a-doption>
                                    <a-doption @click="updatePwdModal.visible = true">
                                        修改密码
                                        <template #icon>
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </template>
                                    </a-doption>
                                    <a-doption @click="on_logoutButton_clicked">
                                        退出登录
                                        <template #icon>
                                            <i class="fa-solid fa-right-from-bracket"></i>
                                        </template>
                                    </a-doption>
                                </template>
                            </ADropdown>
                        </ASpace>
                    </template>
                </APageHeader>
            </ALayoutHeader>
            <ALayoutContent style="padding: 20px 15px">
                <ARow justify="center">
                    <ACol
                        :xs="24"
                        :sm="21"
                        :md="16"
                        :lg="14"
                        :xl="12"
                        :xxl="10"
                    >
                        <ASpace
                            direction="vertical"
                            fill
                            size="large"
                        >
                            <template v-for="(btn, index) in buttonList">
                                <AButton
                                    v-if="!btn.hidden"
                                    class="my-button"
                                    :class="btn.class"
                                    long
                                    :key="index"
                                    @contextmenu.prevent.stop
                                    @click="btn.onClick"
                                >
                                    <template
                                        #icon
                                        v-if="btn.icon"
                                    >
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
    </AScrollbar>

    <!-- 设置抽屉 -->
    <ADrawer
        title="设置"
        v-model:visible="drawer.visible"
        placement="left"
        :footer="false"
    >
        <AForm
            :model="drawer.empty_form"
            auto-label-width
        >
            <AFormItem label="深色模式">
                <ASwitch
                    v-model="appConfigs.darkTheme"
                    :disabled="appConfigs.themeFollowSystem"
                />
            </AFormItem>
            <AFormItem label="主题跟随系统">
                <ASwitch v-model="appConfigs.themeFollowSystem" />
            </AFormItem>
        </AForm>
    </ADrawer>

    <!-- 修改密码模态框 -->
    <UpdatePwdModal v-model:visible="updatePwdModal.visible" />

    <AImagePreview
        v-model:visible="avatarPreview.visible"
        :src="avatarSrc"
        :actions-layout="avatarPreview.actions"
    />
</template>

<style scoped>
.fill-scrollbar-out,
.fill-scrollbar-out :deep(.fill-scrollbar) {
    width: 100%;
    height: 100%;
}

.fill-scrollbar-out :deep(.fill-scrollbar) {
    overflow: auto;
}

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
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
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
body[arco-theme="dark"] .my-button {
    --color-secondary: rgba(var(--gray-9), 0.08);
    --border-color: rgba(var(--gray-9), 0.1);
}

body[arco-theme="dark"] .my-button.exit-button {
    --color-secondary: #c82333;
    --border-color: #c82333;
}

body[arco-theme="dark"] .my-button.exit-button:focus,
body[arco-theme="dark"] .my-button.exit-button:hover {
    --color-secondary-hover: #dc3545;
    --border-color-hover: #dc3545;
}

body[arco-theme="dark"] .my-button :deep(img) {
    filter: invert(100%);
}

.drawer-close-button {
    --color-secondary: #0000;
}
</style>

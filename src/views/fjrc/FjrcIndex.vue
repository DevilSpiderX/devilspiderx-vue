<script setup>
import { DSXMenuIcon as Icon } from "@/components/dsx-menu/index.ts";
import { useAppConfigs } from "@/stores/AppConfigsStore.ts";
import { Scrollbar as AScrollbar, Message } from "@arco-design/web-vue";
import IconHover from "@arco-design/web-vue/es/_components/icon-hover";
import { IconMoonFill, IconSunFill, IconUp } from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/es/tooltip/style/css";
import { computed, onMounted, ref, toRef } from "vue";
import { useRouter } from "vue-router";
import { downloadHistoryApi, uploadHistoryApi } from "./api/fjrc-api.ts";
import { useFjrcStore } from "./stores/FjrcStore.ts";

const props = defineProps({
    onlineCount: {
        type: Number,
        default: 0,
    },
});

const emits = defineEmits(["onlineCountRefresh"]);

const fjrcStore = useFjrcStore();
const appConfigs = useAppConfigs();
const router = useRouter();

function pushToTopic(bank = "A") {
    const bankID = bank.toUpperCase();
    const lastId = fjrcStore.last[bankID];
    if (lastId) {
        router.push(`/fjrc/${bank}/${lastId}`);
    } else {
        router.push(`/fjrc/${bank}/0`);
    }
}

const buttonList = ref([
    {
        label: "财务会计部",
        onClick: () => pushToTopic("A"),
    },
    {
        label: "运营管理部",
        onClick: () => pushToTopic("B"),
    },
    {
        label: "办公室",
        onClick: () => pushToTopic("C"),
    },
    {
        label: "法律合规类",
        onClick: () => pushToTopic("D"),
    },
    {
        label: "风险管理类",
        onClick: () => pushToTopic("E"),
    },
    {
        label: "金融市场类",
        onClick: () => pushToTopic("F"),
    },
    {
        label: "普惠金融部",
        onClick: () => pushToTopic("G"),
    },
    {
        label: "审计部",
        onClick: () => pushToTopic("H"),
    },
    {
        label: "财务会计类(客户经理)",
        onClick: () => pushToTopic("I"),
    },
    {
        label: "法律合规类(客户经理)",
        onClick: () => pushToTopic("J"),
    },
    {
        label: "风险管理类(客户经理)",
        onClick: () => pushToTopic("K"),
    },
    {
        label: "纪检类(客户经理)",
        onClick: () => pushToTopic("L"),
    },
    {
        label: "金融市场类(客户经理)",
        onClick: () => pushToTopic("M"),
    },
    {
        label: "普惠金融类(客户经理)",
        onClick: () => pushToTopic("N"),
    },
    {
        label: "审计类(客户经理)",
        onClick: () => pushToTopic("O"),
    },
    {
        label: "运营管理类(客户经理)",
        onClick: () => pushToTopic("P"),
    },
]);

const historyModal = ref({
    form: { key: toRef(fjrcStore, "historyKey") },
    visible: false,
    buttons: {
        loading: false,
    },
});

const modalButtonEnabled = computed(() => historyModal.value.form.key.length >= 8);
const modalInputStatus = computed(() => {
    const length = historyModal.value.form.key.length;
    return length > 0 && length < 8;
});

async function onUploadButtonClick() {
    historyModal.value.buttons.loading = true;
    const resp = await uploadHistoryApi(historyModal.value.form.key, JSON.stringify(fjrcStore.history));
    if (resp) {
        Message.success("上传成功");
    } else {
        Message.error("上传失败");
    }
    setTimeout(() => (historyModal.value.buttons.loading = false), 3000);
}

async function onDownloadButtonClick() {
    historyModal.value.buttons.loading = true;
    const resp = await downloadHistoryApi(historyModal.value.form.key);
    Message.success("下载成功");
    fjrcStore.history = JSON.parse(resp.value);
    setTimeout(() => (historyModal.value.buttons.loading = false), 3000);
}

const refreshButtonSpining = ref(false);

function onRefreshButtonClick() {
    refreshButtonSpining.value = true;
    emits("onlineCountRefresh", () => {
        refreshButtonSpining.value = false;
    });
}

const fillScrollbarRef = ref(null);
onMounted(() => {
    const scrollTop = sessionStorage.getItem("FjrcIndexScrollTop");
    if (scrollTop) {
        fillScrollbarRef.value.scrollTop(Number(scrollTop));
    }
});

function onFillScrollbarScroll({ target }) {
    if (target && target instanceof HTMLDivElement) {
        sessionStorage.setItem("FjrcIndexScrollTop", target.scrollTop);
    }
}
</script>

<template>
    <AScrollbar
        :class="$style.fillScrollbar"
        :outer-class="$style.fillScrollbarOut"
        ref="fillScrollbarRef"
        @scroll="onFillScrollbarScroll">
        <ALayout>
            <ALayoutHeader>
                <APageHeader :show-back="false">
                    <template #title>
                        <span> 农商行试题 </span>
                    </template>
                    <template #extra>
                        <ASpace>
                            <APopover
                                position="br"
                                :popup-container="`.${$style.fillScrollbar}`">
                                <div class="dot-outer">
                                    <span
                                        class="dot"
                                        :class="props.onlineCount < 1 ? 'dot-red' : 'dot-green'" />
                                </div>
                                <template #content>
                                    当前在线人数：<ATag color="arcoblue">{{ props.onlineCount }}</ATag>
                                    <button
                                        class="refresh-btn"
                                        @click="onRefreshButtonClick">
                                        <i
                                            class="fa-solid fa-arrows-rotate"
                                            :class="{ 'fa-spin': refreshButtonSpining }" />
                                    </button>
                                </template>
                            </APopover>
                            <IconHover>
                                <span
                                    class="history-btn"
                                    tabindex="0"
                                    @click="historyModal.visible = true">
                                    <i class="fa-duotone fa-cloud-arrow-up" />
                                </span>
                            </IconHover>
                            <ASwitch
                                v-model="appConfigs.darkTheme"
                                :disabled="appConfigs.themeFollowSystem"
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
                        :xxl="10">
                        <ASpace
                            direction="vertical"
                            fill
                            size="large">
                            <template v-for="(btn, index) in buttonList">
                                <AButton
                                    v-if="!btn.hidden"
                                    class="my-button"
                                    :class="btn.class"
                                    long
                                    :key="index"
                                    @contextmenu.prevent.stop
                                    @click="btn.onClick">
                                    <template
                                        #icon
                                        v-if="btn.icon">
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
    <AModal
        :modal-class="$style.historyModal"
        v-model:visible="historyModal.visible"
        :footer="false"
        title="同步历史记录"
        width="90%">
        <AForm
            :model="historyModal.form"
            auto-label-width>
            <AFormItem
                field="key"
                label="同步码"
                tooltip="如果同步码与别人相同，则会覆盖别人的历史记录">
                <AInput
                    v-model="historyModal.form.key"
                    placeholder="设定一个不小于8位的码"
                    :error="modalInputStatus" />
            </AFormItem>
            <div class="history-modal-btn-wrap">
                <AButton
                    :disabled="!modalButtonEnabled"
                    @click="onUploadButtonClick"
                    :loading="historyModal.buttons.loading">
                    上 传
                </AButton>
                <AButton
                    :disabled="!modalButtonEnabled"
                    @click="onDownloadButtonClick"
                    :loading="historyModal.buttons.loading">
                    下 载
                </AButton>
            </div>
        </AForm>
    </AModal>
    <ABackTop :target-container="`.${$style.fillScrollbar}`">
        <AButton
            class="site-backtop-btn"
            size="large"
            shape="circle">
            <IconUp />
        </AButton>
    </ABackTop>
</template>

<style scoped>
@import url(styles/dot.css);
@import url(styles/refresh-btn.css);

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

.my-button:focus :deep(img),
.my-button:hover :deep(img) {
    filter: invert(100%);
}

/*深色模式*/
body[arco-theme="dark"] .my-button {
    --color-secondary: rgba(var(--gray-9), 0.08);
    --border-color: rgba(var(--gray-9), 0.1);
}

body[arco-theme="dark"] .my-button :deep(img) {
    filter: invert(100%);
}

.drawer-close-button {
    --color-secondary: #0000;
}

.history-btn {
    cursor: pointer;
}

.history-modal-btn-wrap {
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.site-backtop-btn {
    background: var(--color-bg-5) !important;
    border: 1px solid var(--color-fill-3) !important;
    box-shadow: 0 2px 12px #0000001a;
}
</style>

<style module>
.historyModal {
    max-width: 400px;
}

.fillScrollbarOut {
    width: 100%;
    height: calc(100% - 1px);
}

.fillScrollbar {
    width: 100%;
    height: 100%;
    overflow: auto;
}
</style>

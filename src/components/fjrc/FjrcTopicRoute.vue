<script setup>
import { useAppConfigs } from "@/store/AppConfigsStore";
import { Modal } from "@arco-design/web-vue";
import IconHover from "@arco-design/web-vue/es/_components/icon-hover";
import { computed, h, onMounted, ref, toRef, watchEffect } from "vue";
import { useRouter } from "vue-router";
import FjrcTopic from "./FjrcTopic.vue";
import IndexButtonList from "./IndexButtonList.vue";
import { getTopicApi, getTopicCountApi } from "./api/fjrc-api";
import { useFjrcStore } from "./stores/FjrcStore";

const props = defineProps({
    bank: {
        type: String,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    onlineCount: {
        type: Number,
        default: 0,
    },
});

const emits = defineEmits(["onlineCountRefresh"]);

const fjrcStore = useFjrcStore();
watchEffect(() => {
    fjrcStore.last[props.bank] = props.id;
});

const appConfigs = useAppConfigs();

const TITLE_NAME = {
    A: "财务会计部",
    B: "运营管理部",
    C: "办公室",
    D: "法律合规类",
    E: "风险管理类",
    F: "金融市场类",
    G: "普惠金融部",
    H: "审计部",
    I: "财务会计类(客户经理)",
    J: "法律合规类(客户经理)",
    K: "风险管理类(客户经理)",
    L: "纪检类(客户经理)",
    M: "金融市场类(客户经理)",
    N: "普惠金融类(客户经理)",
    O: "审计类(客户经理)",
    P: "运营管理类(客户经理)",
};

function getTitleName(bank) {
    const bankID = bank.toUpperCase();
    if (bankID in TITLE_NAME) {
        return TITLE_NAME[bankID];
    }
    return TITLE_NAME.A;
}

const defaultTopic = {
    itemBank: "题库",
    type: "题型",
    label: "标签",
    title: "加载中......",
    answer: "",
    a: "加载中...",
    b: "加载中...",
    c: "加载中...",
    d: "加载中...",
};

const topic = ref(defaultTopic);
async function getTopic(bank, id) {
    const resp = await getTopicApi(bank, id);
    topic.value = resp;
}

const loading = ref(true);
watchEffect(async () => {
    loading.value = true;
    await getTopic(props.bank, props.id);
    loading.value = false;
    const _history = history.value[props.id];
    if (_history) {
        const answer = _history.answer;
        let answers;
        if (typeof answer === "string") {
            answers = answer.match(/[a-zA-Z]/g);
        } else if (answer instanceof Array) {
            answers = answer;
        }

        fjrcTopicRef.value.answer(answers);
    }
});

const count = ref(0);
async function getCount(bank) {
    const resp = await getTopicCountApi(bank);
    if (count.value != resp.count) {
        count.value = resp.count;
    }
}

const history = toRef(fjrcStore.history, props.bank);

onMounted(() => {
    getCount(props.bank);
});

const drawer = ref({
    visible: false,
});

const indexButtonTypes = ref({});

watchEffect(() => {
    indexButtonTypes.value = {};
    indexButtonTypes.value[props.id] = "primary";
});

const indexButtonColors = computed(() => {
    const colors = new Array(history.value.length);
    for (let i = 0; i < colors.length; i++) {
        if (!history.value[i]) continue;
        colors[i] = history.value[i].right ? "success" : "danger";
    }
    return colors;
});

const router = useRouter();

async function goTopic(id) {
    if (id < 0 || id >= count.value) return;
    await router.replace(`${id}`);
    drawer.value.visible = false;
}

function onFjrcTopicAnswer(right, answer) {
    history.value[props.id] = { right, answer };
}

const fjrcTopicKey = ref(Symbol(props.id));
watchEffect(() => {
    fjrcTopicKey.value = Symbol(props.id);
});

function onFjrcTopicReset() {
    history.value[props.id] = undefined;
    fjrcTopicKey.value = Symbol(props.id);
}

const fjrcTopicBinds = computed(() => ({
    ...props,
    key: fjrcTopicKey.value,
    topic: topic.value,
    count: count.value,
    loading: loading.value,
}));

const correctRate = computed(() => {
    let success = 0;
    let all = 0;
    for (const item of history.value) {
        if (!item) continue;
        all++;
        if (item.right) {
            success++;
        }
    }

    if (all === 0) {
        return -1;
    }

    return success / all;
});

function getCorrectRateColor(correctRate) {
    if (correctRate < 0.2) {
        return "red";
    }
    if (correctRate < 0.6) {
        return "orange";
    }
    return "green";
}

function resetHistory() {
    Modal.confirm({
        content: () => h("div", { style: { width: "100%", textAlign: "center" } }, "确认重置记录？"),
        width: "auto",
        onOk: () => {
            history.value = [];
            fjrcTopicKey.value = Symbol(props.id);
        },
    });
}

function resetErrorHistory() {
    Modal.confirm({
        content: () => h("div", { style: { width: "100%", textAlign: "center" } }, "确认重置错题记录？"),
        width: "auto",
        onOk: () => {
            const resetCurrent = history.value[props.id] && !history.value[props.id].right;

            for (let i = 0; i < history.value.length; i++) {
                const item = history.value[i];
                if (!item || item.right) continue;
                history.value[i] = undefined;
            }

            if (resetCurrent) fjrcTopicKey.value = Symbol(props.id);
        },
    });
}

/**
 * @type {import("vue").Ref<InstanceType<typeof FjrcTopic> | undefined | null>}
 */
const fjrcTopicRef = ref(null);

const refreshButtonSpining = ref(false);

function onRefreshButtonClick() {
    refreshButtonSpining.value = true;
    emits("onlineCountRefresh", () => {
        refreshButtonSpining.value = false;
    });
}
</script>

<template>
    <ALayout>
        <ALayout>
            <ALayoutHeader>
                <APageHeader @back="$router.back">
                    <template #title>
                        <span> {{ getTitleName(bank) }} </span>
                    </template>
                    <template #extra>
                        <ASpace>
                            <APopover position="br">
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
                            <ATag
                                v-if="correctRate >= 0"
                                :color="getCorrectRateColor(correctRate)">
                                {{ (correctRate * 100).toFixed(0) }}%
                            </ATag>
                            <AButton
                                v-if="appConfigs.client.width < 768"
                                type="text"
                                shape="circle"
                                style="color: var(--color-text-2)"
                                @click="drawer.visible = true">
                                <i class="fa-solid fa-bars" />
                            </AButton>
                        </ASpace>
                    </template>
                </APageHeader>
            </ALayoutHeader>
            <ALayoutContent>
                <FjrcTopic
                    ref="fjrcTopicRef"
                    v-bind="fjrcTopicBinds"
                    @answer="onFjrcTopicAnswer"
                    @reset="onFjrcTopicReset" />
            </ALayoutContent>
        </ALayout>
        <Transition name="sider">
            <ALayoutSider
                v-if="appConfigs.client.width >= 768"
                :width="250">
                <div class="arco-drawer-header">
                    <div class="arco-drawer-title">目录</div>
                    <AButton
                        type="text"
                        size="mini"
                        @click="resetHistory"
                        >重置</AButton
                    >
                    <AButton
                        type="text"
                        size="mini"
                        status="danger"
                        @click="resetErrorHistory"
                        >重置错题</AButton
                    >
                </div>
                <div class="arco-drawer-body">
                    <IndexButtonList
                        :id="props.id"
                        :count="count"
                        :index-button-types="indexButtonTypes"
                        :index-button-colors="indexButtonColors"
                        @click="goTopic" />
                </div>
            </ALayoutSider>
        </Transition>
    </ALayout>

    <ADrawer
        v-if="appConfigs.client.width < 768"
        v-model:visible="drawer.visible"
        placement="right"
        :footer="false">
        <template #header>
            <div class="arco-drawer-title">目录</div>
            <AButton
                type="text"
                size="mini"
                @click="resetHistory"
                >重置</AButton
            >
            <AButton
                type="text"
                size="mini"
                status="danger"
                @click="resetErrorHistory"
                >重置错题</AButton
            >
            <div
                tabindex="-1"
                role="button"
                aria-label="Close"
                class="arco-drawer-close-btn"
                @click="drawer.visible = false">
                <IconHover>
                    <IconClose />
                </IconHover>
            </div>
        </template>
        <IndexButtonList
            v-if="drawer.visible"
            :id="props.id"
            :count="count"
            :index-button-types="indexButtonTypes"
            :index-button-colors="indexButtonColors"
            @click="goTopic" />
    </ADrawer>
</template>

<style scoped>
@import url(./styles/dot.css);
@import url(./styles/refresh-btn.css);

.arco-layout,
.arco-layout-content {
    width: 100%;
    height: 100%;
}

.arco-layout-content {
    overflow: hidden;
}

.arco-layout-sider {
    height: 100%;
}

.arco-layout-sider :deep(.arco-layout-sider-children) {
    display: flex;
    flex-direction: column;
}

.sider-enter-active,
.sider-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 0.69, 0.1, 1);
    transform-origin: right;
}

.sider-leave-active {
    position: fixed;
    right: 0;
}

.sider-enter-from,
.sider-leave-to {
    transform: scaleX(0);
    opacity: 0;
}

.sider-enter-to,
.sider-leave-from {
    transform: scaleX(1);
    opacity: 1;
}
</style>

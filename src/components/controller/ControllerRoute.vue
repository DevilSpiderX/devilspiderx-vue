<script setup>
import { http } from "@/scripts/http";
import { useAppConfigs } from "@/store/AppConfigsStore";
import { Message, Scrollbar as AScrollbar } from "@arco-design/web-vue";
import { computed, onUnmounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { CpuCard, DiskCard, MemoryCard, NetworkCard } from "./components";

const appConfigs = useAppConfigs();
appConfigs.backgroundColor2StatusBarColor();

const props = defineProps({
    cd: {
        type: Number,
        default: 1500
    }
});

watch(() => props.cd, cd => {
    if (ws.websocket !== null) {
        console.log("更改数据刷新速率", cd, "ms");
        ws.websocket.send(JSON.stringify({ cmd: "start", cd }));
        Message.success(`数据刷新速率：${cd}ms`);
    }
});

function setCD(cdValue) {
    router.replace({ query: { cd: cdValue } })
}

const values = reactive({
    cpu: undefined,
    memory: undefined,
    network: undefined,
    disk: [],
    os: undefined
});
const ws = {
    websocket: WebSocket.prototype,
    token: "",
    time_str: "",
    WsOnOPen() {
        Message.success({ content: "WebSocket成功接入服务器", duration: 1000 });
        console.log(Date() + "\nWebSocket成功接入服务器");
        if (ws.websocket !== null) {
            ws.websocket.send(JSON.stringify({ cmd: "start", cd: props.cd }));
        }
    },
    WsOnClose() {
        Message.success({ content: "WebSocket连接已关闭", duration: 1000 });
        console.log(Date() + "\n连接已关闭");
    },
    WsOnError(event) {
        Message.error({ content: "WebSocket发生错误", duration: 1000 });
        console.log(event);
        console.log(Date() + "\nWebSocket发生错误，使用POST请求获取信息");
        // getHardware();
    },
    WsOnMessage(msgEvent) {
        Object.assign(values, JSON.parse(msgEvent.data));
    }
};

const router = useRouter();
(async () => {
    try {
        let resp = await http.serverInfo.token();
        console.log("token:", resp);
        if (resp.code === 0) {
            ws.token = resp.data.token;
            ws.time_str = resp.data.timeStr;
            let wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
            ws.websocket = new WebSocket(`${wsProtocol}//${location.host}/websocket/getServerInfo/${ws.token}/${ws.time_str}`);
            ws.websocket.onopen = ws.WsOnOPen;
            ws.websocket.onclose = ws.WsOnClose;
            ws.websocket.onerror = ws.WsOnError;
            ws.websocket.onmessage = ws.WsOnMessage;
        } else {
            router.push({ name: "login" });
        }
    } catch (error) {
        console.error("(beforeCreate)", `url:${error.config?.url}`, error);
        Message.error("服务器错误");
        router.back();
    }
})();

onUnmounted(() => {
    if (ws.websocket instanceof WebSocket && ws.websocket.readyState === WebSocket.OPEN) {
        ws.websocket.close();
    }
});

const speedModal = reactive({
    visible: false
});

watch(() => speedModal.visible, visible => {
    appConfigs.statusBarColor = visible ? appConfigs.darkTheme ? "#17171a" : "#777a7f"
        : window.getComputedStyle(document.body).backgroundColor;
});

function speed_modal_input_change(val) {
    setCD(val);
    speedModal.visible = false;
}

const cardsProps = reactive({
    class: "my-col",
    xs: 24,
    md: 12,
    xl: 8
});

const pageHeaderBoxShadow = ref(undefined);

function main_card_scrollbar_scroll(event) {
    pageHeaderBoxShadow.value = event.target?.scrollTop === 0 ? undefined : "var(--bs-shadow)";
}

const mainCardScrollbarStyle = reactive({
    overflow: "auto",
    width: "100%",
    height: computed(() => {
        const height = appConfigs.client.height - 65;
        return height <= 0 ? "0" : `${height}px`;
    })
});

</script>

<template>
    <ALayout>
        <ALayoutHeader style="max-height: 65px;z-index: 101" :style="{ boxShadow: pageHeaderBoxShadow }">
            <APageHeader @back="$router.back">
                <template #title>
                    <span> 控制中心 </span>
                </template>
                <template #extra>
                    <ATooltip v-if="appConfigs.client.width <= 576" :content="String(cd)" mini>
                        <AButton shape="round" @click="speedModal.visible = true">刷新速率</AButton>
                    </ATooltip>
                    <AInputNumber v-else :model-value="cd" @update:model-value="val => setCD(val)" :min="500"
                        hide-button style="max-width: 12em">
                        <template #prefix>
                            <span>刷新速率</span>
                        </template>
                        <template #suffix>
                            <span>ms</span>
                        </template>
                    </AInputNumber>
                </template>
            </APageHeader>
        </ALayoutHeader>
        <ALayoutContent>
            <AScrollbar :style="mainCardScrollbarStyle" @scroll="main_card_scrollbar_scroll">
                <ACard class="main-card" :header-style="{ height: 'auto' }" style="background-color: var(--color-bg-1)">
                    <template #title>
                        <div>
                            <h1 style="text-align: center;user-select: none;margin: 0;font-size: 1.5rem">
                                <i class="fas fa-server fa-fw"></i>
                                服务器状态监控
                            </h1>
                        </div>
                    </template>
                    <ARow :gutter="10" align="stretch">
                        <ACol v-bind="cardsProps">
                            <CpuCard :value="values.cpu" :loading="!values.cpu" />
                        </ACol>
                        <ACol v-bind="cardsProps">
                            <MemoryCard :value="values.memory" :process-count="values.os?.processCount"
                                :loading="!values.memory" />
                        </ACol>
                        <ACol v-bind="cardsProps">
                            <NetworkCard :value="values.network" :loading="!values.network" />
                        </ACol>
                        <TransitionGroup name="body">
                            <ACol v-for="(disk, index) in values.disk" v-bind="cardsProps" :key="index">
                                <DiskCard :value="disk" :disk-index="index" />
                            </ACol>
                        </TransitionGroup>
                    </ARow>
                </ACard>
            </AScrollbar>
        </ALayoutContent>
    </ALayout>
    <AModal title="数据刷新速率" v-model:visible="speedModal.visible" width="auto" simple :footer="false">
        <AInputNumber :model-value="cd" @update:model-value="speed_modal_input_change" :min="500" hide-button
            style="max-width: 15em">
            <template #suffix>
                <span>ms</span>
            </template>
        </AInputNumber>
    </AModal>
</template>

<style scoped>
@import url(./styles/card-transition.css);

.main-card {
    box-sizing: border-box;
    border: 0;
}

.my-col {
    padding-bottom: 10px;
}

.my-col > * {
    height: 100%;
}

.my-col:hover {
    z-index: 1;
}
</style>
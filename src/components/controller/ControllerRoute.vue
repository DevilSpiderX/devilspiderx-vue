<script setup>
import { onUnmounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import CpuCard from "./CpuCard.vue";
import MemoryCard from "./MemoryCard.vue";
import NetworkCard from "./NetworkCard.vue";
import DiskCard from "./DiskCard.vue";
import http from "@/scripts/server-api";
import { useAppConfigs } from "@/store/AppConfigsStore";

const appConfigs = useAppConfigs();
appConfigs.statusBarColor = window.getComputedStyle(document.body).backgroundColor;

const props = defineProps({
    cd: {
        type: Number,
        default: 1500
    }
});

watch(() => props.cd, newVal => {
    if (ws.websocket !== null) {
        console.log("更改数据刷新速率", newVal, "ms");
        ws.websocket.send(JSON.stringify({ "cmd": "start", "cd": newVal }));
        Message.success(`数据刷新速率：${newVal}ms`);
    }
});

function setCD(cdValue) {
    router.replace({ query: { cd: cdValue } })
}

const empty_show = ref(true);
const values = reactive({
    cpu: undefined,
    memory: undefined,
    network: undefined,
    disk: [],
    os: undefined
});
const ws = {
    websocket: null,
    token: "",
    time_str: "",
    WsOnOPen() {
        Message.success({ content: "WebSocket成功接入服务器", duration: 1000 });
        console.log(Date() + "\nWebSocket成功接入服务器");
        if (ws.websocket !== null) {
            ws.websocket.send(JSON.stringify({ "cmd": "start", "cd": props.cd }));
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
        empty_show.value = false;
        Object.assign(values, JSON.parse(msgEvent.data));
    }
};

const router = useRouter();
(async () => {
    try {
        let resp = await http.serverInfo.token();
        console.log("token:", resp);
        if (resp["code"] === 0) {
            ws.token = resp["data"]["token"];
            ws.time_str = resp["data"]["timeStr"];
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

const mainCard = reactive({
    class: {
        'scrollBar-hide': true
    }
});

function main_card_mouse_enter() {
    if (!appConfigs.isTouchDevice) {
        mainCard.class["scrollBar-hide"] = false;
    }
}

function main_card_mouse_leave() {
    mainCard.class["scrollBar-hide"] = true;
}

const speedModal = reactive({
    visible: false
});

function speed_modal_input_change(val) {
    setCD(val);
    speedModal.visible = false;
}

</script>

<template>
    <ALayout style="height:100%">
        <ALayoutHeader style="border-bottom: 1px solid #84858d55;max-height: 65px">
            <APageHeader @back="$router.back">
                <template #title>
                    <span> 控制中心 </span>
                </template>
                <template #extra>
                    <ATooltip v-if="appConfigs.window.width <= 576" :content="String($props.cd)" mini>
                        <AButton shape="round" @click="speedModal.visible = true">刷新速率</AButton>
                    </ATooltip>
                    <AInputNumber v-else :model-value="$props.cd" @update:model-value="val => setCD(val)" :min="500"
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
        <ALayoutContent style="height: calc(100% - 65px)">
            <ACard class="main-card" :class="mainCard.class" :header-style="{ height: 'auto' }"
                :style="{ height: '100%', backgroundColor: 'var(--color-bg-1)' }" @mouseenter="main_card_mouse_enter"
                @mouseleave="main_card_mouse_leave">
                <template #title>
                    <div>
                        <h1 style="text-align: center;user-select: none;margin: 0;font-size: 1.5rem">
                            <i class="fas fa-server fa-fw"></i>
                            服务器状态监控
                        </h1>
                    </div>
                </template>
                <ARow :gutter="10" align="stretch">
                    <TransitionGroup name="body">
                        <ACol :xs="24" :md="12" :xl="8" class="my-col" v-if="values.cpu">
                            <CpuCard :value="values.cpu" />
                        </ACol>
                        <ACol :xs="24" :md="12" :xl="8" class="my-col" v-if="values.memory">
                            <MemoryCard :value="values.memory" :process-count="values.os?.processCount" />
                        </ACol>
                        <ACol :xs="24" :md="12" :xl="8" class="my-col" v-if="values.network">
                            <NetworkCard :value="values.network" />
                        </ACol>
                        <ACol :xs="24" :md="12" :xl="8" class="my-col" v-for="(disk, index) in values.disk"
                            :key="index + 3">
                            <DiskCard :value="disk" :disk-index="index" />
                        </ACol>
                    </TransitionGroup>
                </ARow>
                <template #cover>
                    <AEmpty v-if="empty_show" />
                </template>
            </ACard>
        </ALayoutContent>
    </ALayout>
    <AModal title="数据刷新速率" v-model:visible="speedModal.visible" width="auto" simple :footer="false">
        <AInputNumber :model-value="$props.cd" @update:model-value="speed_modal_input_change" :min="500" hide-button
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
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    border: 0;
}

.my-col {
    padding-bottom: 10px;
}

.my-col > * {
    height: 100%;
}

.my-col:hover {
    z-index: 100;
}

.main-card::-webkit-scrollbar {
    z-index: 1;
    width: 8px;
}

/*noinspection CssUnusedSymbol*/
.main-card.scrollBar-hide::-webkit-scrollbar {
    display: none;
}

.main-card::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #00000040;
}

body[arco-theme='dark'] .main-card::-webkit-scrollbar-thumb {
    background: #ffffff40;
}

.main-card::-webkit-scrollbar-corner,
.main-card::-webkit-scrollbar-track,
.main-card::-webkit-scrollbar-track-piece {
    background: #0000;
}
</style>
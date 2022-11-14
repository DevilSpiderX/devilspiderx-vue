<script setup>
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import CpuCard from "./CpuCard.vue";
import MemoryCard from "./MemoryCard.vue";
import NetworkCard from "./NetworkCard.vue";
import DiskCard from "./DiskCard.vue";
import http from "@/scripts/server-api";
import { useAppConfigs } from "@/store/AppConfigsStore";

const appConfigs = useAppConfigs();
appConfigs.statusBarColor = window.getComputedStyle(document.body).backgroundColor;

const router = useRouter();
const route = useRoute();
const cd = ref(Object.hasOwn(route.query, "cd") ? Number(route.query.cd) : 1500);
watch(cd, newVal => {
    if (ws.websocket !== null) {
        console.log("更改数据刷新速率", newVal, "ms");
        ws.websocket.send(JSON.stringify({"cmd": "start", "cd": newVal}));
    }
});
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
        Message.success({content: "WebSocket成功接入服务器", duration: 1000});
        console.log(Date() + "\nWebSocket成功接入服务器");
        if (ws.websocket !== null) {
            ws.websocket.send(JSON.stringify({"cmd": "start", "cd": cd.value}));
        }
    },
    WsOnClose() {
        Message.success({content: "WebSocket连接已关闭", duration: 1000});
        console.log(Date() + "\n连接已关闭");
    },
    WsOnError(event) {
        Message.error({content: "WebSocket发生错误", duration: 1000});
        console.log(event);
        console.log(Date() + "\nWebSocket发生错误，使用POST请求获取信息");
        // getHardware();
    },
    WsOnMessage(msgEvent) {
        empty_show.value = false;
        Object.assign(values, JSON.parse(msgEvent.data));
    }
};

(async () => {
    try {
        let resp = await http.token();
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
            await router.push({name: "login"});
        }
    } catch (error) {
        console.error("(beforeCreate)", `url:${error.config?.url}`, error);
        Message.error("服务器错误");
        router.back();
    }
})();

onMounted(() => {
    window.addEventListener('resize', window_resize);//等相对单位dvh标准出来之后删除
});

onUnmounted(() => {
    if (ws.websocket instanceof WebSocket && ws.websocket.readyState === WebSocket.OPEN) {
        ws.websocket.close();
    }
    window.removeEventListener('resize', window_resize);//等相对单位dvh标准出来之后删除
});

const mainCard = reactive({
    height: window.innerHeight - 1,//等相对单位dvh标准出来之后删除
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

function window_resize() {//等相对单位dvh标准出来之后删除
    mainCard.height = window.innerHeight - 1;
}

</script>

<template>
    <a-layout>
        <a-card class="main-card" :class="mainCard.class" :header-style="{height:'auto'}"
            :style="{height:mainCard.height+'px',backgroundColor:'var(--color-bg-1)'}"
            @mouseenter="main_card_mouse_enter" @mouseleave="main_card_mouse_leave">
            <template #title>
                <div>
                    <h1 style="text-align: center;user-select: none;margin: 0;font-size: 1.5rem">
                        <i class="fas fa-server fa-fw"></i>
                        服务器状态监控
                    </h1>
                </div>
            </template>
            <a-row :gutter="10" align="stretch">
                <transition-group name="body">
                    <a-col :xs="24" :md="12" :xl="8" class="my-col" v-if="values.cpu">
                        <cpu-card :value="values.cpu" />
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="8" class="my-col" v-if="values.memory">
                        <memory-card :value="values.memory" :process-count="values.os?.processCount" />
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="8" class="my-col" v-if="values.network">
                        <network-card :value="values.network" />
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="8" class="my-col" v-for="(disk,index) in values.disk" :key="index+3">
                        <disk-card :value="disk" :disk-index="index" />
                    </a-col>
                </transition-group>
            </a-row>
            <template #cover>
                <a-empty v-if="empty_show" />
            </template>
        </a-card>
    </a-layout>
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
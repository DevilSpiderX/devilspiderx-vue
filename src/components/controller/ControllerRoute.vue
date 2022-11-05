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
                        <cpu-card :value="values.cpu"/>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="8" class="my-col" v-if="values.memory">
                        <memory-card :value="values.memory"/>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="8" class="my-col" v-if="values.network">
                        <network-card :value="values.network"/>
                    </a-col>
                    <a-col :xs="24" :md="12" :xl="8" class="my-col" v-for="(disk,index) in values.disk" :key="index+3">
                        <disk-card :value="disk" :disk-index="index"/>
                    </a-col>
                </transition-group>
            </a-row>
            <template #cover>
                <a-empty v-if="empty_show"/>
            </template>
        </a-card>
    </a-layout>
</template>

<script>
import router from "../../router.js";
import {Message} from "@arco-design/web-vue";
import CpuCard from "./CpuCard.vue";
import MemoryCard from "./MemoryCard.vue";
import NetworkCard from "./NetworkCard.vue";
import DiskCard from "./DiskCard.vue";
import http from "/src/scripts/server-api";

export default {
    name: "ControllerRoute",
    components: {CpuCard, MemoryCard, NetworkCard, DiskCard},
    data() {
        return {
            cd: 1500,
            ws: {
                websocket: null,
                token: "",
                time_str: ""
            },
            values: {
                cpu: undefined,
                memory: undefined,
                network: undefined,
                disk: []
            },
            mainCard: {
                height: window.innerHeight - 1,//等相对单位dvh标准出来之后删除
                class: {
                    'scrollBar-hide': true
                }
            },
            empty_show: true
        }
    },
    watch: {
        'ws.websocket'(websocket, old) {
            if (old instanceof WebSocket && old.readyState === WebSocket.OPEN) {
                old.close();
            }
            if (websocket instanceof WebSocket) {
                websocket.onopen = this.WsOnOPen;
                websocket.onclose = this.WsOnClose;
                websocket.onerror = this.WsOnError;
                websocket.onmessage = this.WsOnMessage;
            }
        }
    },
    async beforeCreate() {
        try {
            let resp = await http.token();
            console.log("token:", resp);
            if (resp["code"] === 0) {
                this.ws.token = resp["data"]["token"];
                this.ws.time_str = resp["data"]["timeStr"];
                let wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
                this.ws.websocket = new WebSocket(`${wsProtocol}//${location.host}/websocket/getServerInfo/${this.ws.token}/${this.ws.time_str}`);
            } else {
                await router.push({name: "login"});
            }
        } catch (error) {
            console.error("beforeCreate:", error);
            Message.error("服务器错误");
            router.back();
        }
    },
    beforeMount() {
        this.setThemeColor(window.getComputedStyle(document.body).backgroundColor);
    },
    mounted() {
        window.addEventListener('resize', this.window_resize);//等相对单位dvh标准出来之后删除
    },
    unmounted() {
        if (this.ws.websocket instanceof WebSocket && this.ws.websocket.readyState === WebSocket.OPEN) {
            this.ws.websocket.close();
        }
        window.removeEventListener('resize', this.window_resize);//等相对单位dvh标准出来之后删除
    },
    methods: {
        WsOnOPen() {
            Message.success({content: "WebSocket成功接入服务器", duration: 1000});
            console.log(Date() + "\nWebSocket成功接入服务器");
            this.ws.websocket.send(JSON.stringify({"cmd": "start", "cd": this.cd}));
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
            this.empty_show = false;
            this.values = JSON.parse(msgEvent.data);
        },
        main_card_mouse_enter() {
            if (!this.isTouchDevice) {
                this.mainCard.class["scrollBar-hide"] = false;
            }
        },
        main_card_mouse_leave() {
            this.mainCard.class["scrollBar-hide"] = true;
        },
        window_resize() {//等相对单位dvh标准出来之后删除
            this.mainCard.height = window.innerHeight - 1;
        }
    }
}
</script>

<style scoped>
@import url(/src/components/controller/styles/card-transition.css);

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
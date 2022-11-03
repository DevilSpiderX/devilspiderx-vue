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
                <a-col :xs="24" :md="12" :xl="8" class="my-col">
                    <cpu-card :value="values.cpu"/>
                </a-col>
                <a-col :xs="24" :md="12" :xl="8" class="my-col">
                    <memory-card :value="values.memory"/>
                </a-col>
                <a-col :xs="24" :md="12" :xl="8" class="my-col">
                    <network-card :value="values.network"/>
                </a-col>
                <a-col :xs="24" :md="12" :xl="8" class="my-col"
                       v-for="(disk,index) in values.disk">
                    <disk-card :value="disk" :disk-index="index"/>
                </a-col>
            </a-row>
        </a-card>
    </a-layout>
</template>

<script>
import {Message} from "@arco-design/web-vue";
import CpuCard from "./CpuCard.vue";
import MemoryCard from "./MemoryCard.vue";
import NetworkCard from "./NetworkCard.vue";
import DiskCard from "./DiskCard.vue";
import {token} from "/src/scripts/server-api.js";

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
                cpu: {
                    name: "",
                    physicalNum: 0,
                    logicalNum: 0,
                    usedRate: 0,
                    is64bit: true,
                    cpuTemperature: 0
                },
                memory: {
                    total: 1,
                    used: 0,
                    free: 0,
                    format: {
                        total: {value: 0, unit: "B"},
                        used: {value: 0, unit: "B"},
                        free: {value: 0, unit: "B"}
                    }
                },
                network: {
                    uploadSpeed: 0,
                    downloadSpeed: 0,
                    format: {
                        uploadSpeed: {value: 0, unit: "B/s"},
                        downloadSpeed: {value: 0, unit: "B/s"}
                    }
                },
                disk: [{
                    label: "",
                    mount: "",
                    fSType: "",
                    name: "",
                    total: 1,
                    free: 0,
                    used: 0,
                    format: {
                        total: {value: 0, unit: "B"},
                        free: {value: 0, unit: "B"},
                        used: {value: 0, unit: "B"}
                    }
                }]
            },
            mainCard: {
                height: window.innerHeight - 1,//等相对单位dvh标准出来之后删除
                class: {
                    'scrollBar-hide': true
                }
            }
        }
    },
    watch: {
        'ws.websocket'(websocket, old) {
            if (old instanceof WebSocket && old.readyState === WebSocket.OPEN) {
                old.close();
            }
            websocket.onopen = this.WsOnOPen;
            websocket.onclose = this.WsOnClose;
            websocket.onerror = this.WsOnError;
            websocket.onmessage = this.WsOnMessage;
        }
    },
    beforeCreate() {
        token(function (resp) {
            if (resp["code"] === 0) {
                this.ws.token = resp["data"]["token"];
                this.ws.time_str = resp["data"]["timeStr"];
                let wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
                this.ws.websocket = new WebSocket(`${wsProtocol}//${location.host}/websocket/getServerInfo/${this.ws.token}/${this.ws.time_str}`);
            } else {
                this.$router.push({name: "login"});
            }
        }.bind(this), function () {
            Message.error("服务器错误");
            this.$router.back();
        }.bind(this));
    },
    beforeMount() {
        this.setThemeColor("#ffffff");
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
            if (typeof this.ws.websocket !== 'undefined') {
                this.ws.websocket.send(JSON.stringify({"cmd": "start", "cd": this.cd}));
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
        WsOnMessage(msgEv) {
            this.values = JSON.parse(msgEv.data);
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
<template>
    <el-container>
        <el-card class="main-card">
            <template #header>
                <div>
                    <h1 style="text-align: center;user-select: none;margin: 0;">
                        <i class="fas fa-server fa-fw"></i>
                        服务器状态监控
                    </h1>
                </div>
            </template>
            <el-row gutter="10">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" class="my-col">
                    <cpu-card :value="values.cpu"/>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="6" class="my-col">
                    <memory-card :value="values.memory"/>
                </el-col>
            </el-row>
        </el-card>
    </el-container>
</template>

<script>
import {ElMessage} from "element-plus";
import CpuCard from "./controller/CpuCard";
import MemoryCard from "./controller/MemoryCard";
import {token} from "@/js/server-api";

export default {
    name: "ControllerRoute",
    components: {CpuCard, MemoryCard},
    data() {
        return {
            cd: 1500,
            ws: {
                websocket: null,
                token: "",
                time_str: ""
            },
            values: {
                cpu: {},
                memory: {},
                network: {},
                disk: []
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
            }
        }.bind(this), function () {
            ElMessage.error("服务器错误");
            this.$router.back();
        }.bind(this));
    },
    beforeMount() {
        this.setThemeColor("#ffffff");
    },
    mounted() {

    },
    unmounted() {
        if (this.ws.websocket instanceof WebSocket && this.ws.websocket.readyState === WebSocket.OPEN) {
            this.ws.websocket.close();
        }
    },
    methods: {
        WsOnOPen() {
            ElMessage.success("WebSocket成功接入服务器");
            console.log(Date() + "\nWebSocket成功接入服务器");
            if (typeof this.ws.websocket !== 'undefined') {
                this.ws.websocket.send(JSON.stringify({"cmd": "start", "cd": this.cd}));
            }
        },
        WsOnClose() {
            ElMessage.success("WebSocket连接已关闭");
            console.log(Date() + "\n连接已关闭");
        },
        WsOnError(event) {
            ElMessage.error("WebSocket发生错误");
            console.log(event);
            console.log(Date() + "\nWebSocket发生错误，使用POST请求获取信息");
            // getHardware();
        },
        WsOnMessage(msgEv) {
            this.values = JSON.parse(msgEv.data);
        },
    }
}
</script>

<style scoped src="../css/nav-back-button.css"></style>

<style scoped>
.main-card {
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
}

.my-col > * {
    height: 100%;
}

.my-col:hover {
    z-index: 100;
}

.main-card::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
}

.main-card::-webkit-scrollbar:horizontal {
    height: 6px;
}

.main-card::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #c0c4cc;
}

.main-card::-webkit-scrollbar-corner {
    background: #ffffff;
}

.main-card::-webkit-scrollbar-track {
    background: #ffffff;
}

.main-card::-webkit-scrollbar-track-piece {
    background: #ffffff;
    width: 6px;
}
</style>
import {
    cpu as cpuApi,
    disks as disksApi,
    memory as memoryApi,
    networks as networksApi,
    os as osApi,
    token as tokenApi,
} from "@/api/server-info-api";
import { status as statusApi } from "@/api/user-api";
import router from "@/router";
import { sleep } from "@/util/util";
import { Message } from "@arco-design/web-vue";
import type { Ref } from "vue";
import { h, onUnmounted, ref } from "vue";
import type { ValuesType } from "../types/type";

class ServerInfoReceiver {
    token: string;
    websocket: WebSocket;
    values: Ref<ValuesType>;
    cd: number;
    closed: boolean;

    constructor(values: Ref<ValuesType>, token: string, cd: number) {
        this.values = values;
        this.token = token;
        this.cd = cd;
        this.closed = false;
        const wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
        this.websocket = new WebSocket(`${wsProtocol}//${location.host}/websocket/getServerInfo?token=${token}`);
        this.websocket.onopen = this.onOpen.bind(this, cd);
        this.websocket.onclose = this.onClose.bind(this);
        this.websocket.onerror = this.onError.bind(this);
        this.websocket.onmessage = this.onMessage.bind(this);
    }

    onOpen(cd: number) {
        Message.success({
            id: "server-info-receiver",
            content: "推送服务接入成功",
            duration: 1000,
        });
        console.log(`${Date()}\nWebSocket成功接入服务器`);
        this.setCD(cd);
    }

    onClose(ev: CloseEvent) {
        Message.success({
            id: "server-info-receiver",
            content: "推送服务已关闭",
            duration: 1000,
        });
        console.log(`${Date()}\nWebSocket连接已关闭(code${ev.code}:${ev.reason})`);
        if (ev.code === 1000) {
            statusApi().then(resp => {
                if (!resp.login) {
                    router.push({ name: "login" });
                }
            });
        }
    }

    onError(event: Event) {
        Message.error({
            id: "server-info-receiver",
            content: () => h("span", null, ["连接服务发生错误", h("br"), "使用Http请求获取信息"]),
            duration: 1000,
        });
        console.log(event);
        console.log(Date() + "\nWebSocket连接发生错误，使用Http请求获取信息");
        this.getHardware();
    }

    onMessage(msgEvent: MessageEvent<any>) {
        Object.assign(this.values.value, JSON.parse(msgEvent.data));
    }

    isWSOpen() {
        return this.websocket.readyState === WebSocket.OPEN;
    }

    send(msg: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if (this.isWSOpen()) {
            this.websocket.send(msg);
        }
    }

    setCD(cd: number) {
        this.cd = cd;
        this.send(JSON.stringify({ cmd: "start", cd }));
    }

    close() {
        if (this.isWSOpen()) {
            this.send(JSON.stringify({ cmd: "stop" }));
            this.websocket.close(1000, "客户端主动关闭");
        }
        this.closed = true;
    }

    async getHardware() {
        while (!this.closed) {
            cpuApi().then(resp => {
                this.values.value.cpu = resp;
            });
            memoryApi().then(resp => {
                this.values.value.memory = resp;
            });
            networksApi().then(resp => {
                this.values.value.networks = resp;
            });
            disksApi().then(resp => {
                this.values.value.disks = resp;
            });
            osApi().then(resp => {
                this.values.value.os = resp;
            });
            await sleep(this.cd);
        }
    }
}

async function generate(receiver: Ref<ServerInfoReceiver | null>, values: Ref<ValuesType>, cd: number) {
    try {
        const resp = await tokenApi();
        console.log("token:", resp);
        receiver.value = new ServerInfoReceiver(values, resp.token, cd);
    } catch (error: any) {
        console.error("(beforeCreate)", `url:${error.config?.url}`, error);
        Message.error({
            id: "server-info-receiver",
            content: "服务器错误",
        });
        router.back();
    }
}

export function useServerInfoReceiver(cd: number) {
    const values = ref<ValuesType>({
        cpu: undefined,
        memory: undefined,
        networks: [],
        disks: [],
        os: undefined,
    });

    const receiver: Ref<ServerInfoReceiver | null> = ref(null);
    generate(receiver, values, cd);

    function close() {
        receiver.value?.close();
    }

    onUnmounted(close);

    return {
        values,
        setCD(cd: number) {
            if (receiver.value) {
                receiver.value.setCD(cd);
            }
        },
        close,
    };
}

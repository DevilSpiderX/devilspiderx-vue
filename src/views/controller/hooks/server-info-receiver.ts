import {
    cpu as cpuApi,
    disks as disksApi,
    memory as memoryApi,
    networks as networksApi,
    os as osApi,
} from "@/api/server-info-api.ts";
import { status as statusApi } from "@/api/user-api.ts";
import { getLogger } from "@/plugins/logger.ts";
import router from "@/routers";
import { useUserStore } from "@/stores/UserStore.ts";
import { sleep } from "@/utils/util.ts";
import { isBlank } from "@/utils/validate.ts";
import { Message } from "@arco-design/web-vue";
import type { Ref } from "vue";
import { h, onUnmounted, ref } from "vue";
import type { ValuesType } from "../types/type.ts";

const logger = getLogger(import.meta.filePath);

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
        logger.set(import.meta.codeLineNum).info("WebSocket成功接入服务器");
        this.setCD(cd);
    }

    onClose(ev: CloseEvent) {
        Message.success({
            id: "server-info-receiver",
            content: "推送服务已关闭",
            duration: 1000,
        });
        logger.set(import.meta.codeLineNum).info(`WebSocket连接已关闭(code${ev.code}:${ev.reason})`);
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
        logger.set(import.meta.codeLineNum).error("WebSocket连接发生错误，使用Http请求获取信息", event);
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
    const userStore = useUserStore();
    const token = isBlank(userStore.token) ? "" : userStore.token;

    receiver.value = new ServerInfoReceiver(values, token, cd);
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

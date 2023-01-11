import router from "@/router/router";
import { http } from "@/scripts/http";
import { sleep } from "@/util/util";
import { Message } from "@arco-design/web-vue";
import { onUnmounted, reactive, Ref, ref } from "vue";
import { ValuesType } from "../scripts/interface";


class ServerInfoReceiver {
    token: string
    websocket: WebSocket
    values: ValuesType
    cd: number
    closed: boolean

    constructor(values: ValuesType, token: string, cd: number) {
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
        Message.success({ content: "WebSocket成功接入服务器", duration: 1000 });
        console.log(Date() + "\nWebSocket成功接入服务器");
        this.setCD(cd);
    }

    onClose() {
        Message.success({ content: "WebSocket连接已关闭", duration: 1000 });
        console.log(Date() + "\n连接已关闭");
    }

    onError(event: Event) {
        Message.error({ content: "WebSocket发生错误，使用Http请求获取信息", duration: 1000 });
        console.log(event);
        console.log(Date() + "\nWebSocket发生错误，使用Http请求获取信息");
        this.getHardware();
    }

    onMessage(msgEvent: MessageEvent<any>) {
        Object.assign(this.values, JSON.parse(msgEvent.data));
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
            this.websocket.close();
        }
        this.closed = true;
    }

    async getHardware() {
        while (!this.closed) {
            http.serverInfo.cpu().then(resp => {
                if (resp.code === 0) {
                    this.values.cpu = { ...resp.data }
                }
            });
            http.serverInfo.memory().then(resp => {
                if (resp.code === 0) {
                    this.values.memory = { ...resp.data }
                }
            });
            http.serverInfo.network().then(resp => {
                if (resp.code === 0) {
                    this.values.network = { ...resp.data }
                }
            });
            http.serverInfo.disk().then(resp => {
                if (resp.code === 0) {
                    this.values.disk = [...resp.data]
                }
            });
            http.serverInfo.os().then(resp => {
                if (resp.code === 0) {
                    this.values.os = { ...resp.data }
                }
            });
            await sleep(this.cd);
        }
    }
}

async function generate(receiver: Ref<ServerInfoReceiver | null>, values: ValuesType, cd: number) {
    try {
        const resp = await http.serverInfo.token();
        console.log("token:", resp);
        if (resp.code === 0) {
            receiver.value = new ServerInfoReceiver(values, resp.data.token, cd);
        } else {
            router.push({ name: "login" });
        }
    } catch (error: any) {
        console.error("(beforeCreate)", `url:${error.config?.url}`, error);
        Message.error("服务器错误");
        router.back();
    }
}

export function useServerInfoReceiver(cd: number) {
    const values = reactive<ValuesType>({
        cpu: undefined,
        memory: undefined,
        network: undefined,
        disk: [],
        os: undefined
    });

    const receiver: Ref<ServerInfoReceiver | null> = ref(null);
    generate(receiver, values, cd);

    function close() {
        if (receiver.value) {
            receiver.value.close();
        }
    }

    onUnmounted(close);

    return {
        values,
        setCD(cd: number) {
            if (receiver.value) {
                receiver.value.setCD(cd);
            }
        },
        close
    }
}
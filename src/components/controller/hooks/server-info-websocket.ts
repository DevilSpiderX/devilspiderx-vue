import router from "@/router/router";
import { http } from "@/scripts/http";
import { Message } from "@arco-design/web-vue";
import { onUnmounted, reactive, Ref, ref } from "vue";
import { ValuesType } from "../scripts/interface";


class ServerInfoWebSocket {
    token: string
    websocket: WebSocket
    values: ValuesType

    constructor(values: ValuesType, token: string, cd: number) {
        this.values = values;
        this.token = token;
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
        Message.error({ content: "WebSocket发生错误", duration: 1000 });
        console.log(event);
        console.log(Date() + "\nWebSocket发生错误，使用POST请求获取信息");
        // getHardware();
    }

    onMessage(msgEvent: MessageEvent<any>) {
        Object.assign(this.values, JSON.parse(msgEvent.data));
    }

    isOpen() {
        return this.websocket.readyState === WebSocket.OPEN;
    }

    send(msg: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if (this.isOpen()) {
            this.websocket.send(msg);
        }
    }

    setCD(cd: number) {
        this.send(JSON.stringify({ cmd: "start", cd }));
    }

    close() {
        if (this.isOpen()) {
            this.websocket.close();
        }
    }
}

async function generate(ws: Ref<ServerInfoWebSocket | null>, values: ValuesType, cd: number) {
    try {
        let resp = await http.serverInfo.token();
        console.log("token:", resp);
        if (resp.code === 0) {
            ws.value = new ServerInfoWebSocket(values, resp.data.token, cd);
        } else {
            router.push({ name: "login" });
        }
    } catch (error: any) {
        console.error("(beforeCreate)", `url:${error.config?.url}`, error);
        Message.error("服务器错误");
        router.back();
    }
}

export function useServerInfoWebSocket(cd: number) {
    const values = reactive<ValuesType>({
        cpu: undefined,
        memory: undefined,
        network: undefined,
        disk: [],
        os: undefined
    });

    const ws: Ref<ServerInfoWebSocket | null> = ref(null);
    generate(ws, values, cd);

    function close() {
        if (ws.value) {
            ws.value.close();
        }
    }

    onUnmounted(close);

    return {
        values,
        setCD(cd: number) {
            if (ws.value) {
                ws.value.setCD(cd);
            }
        },
        close
    }
}
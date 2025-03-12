import {
    cpu as cpuApi,
    disks as disksApi,
    memory as memoryApi,
    networks as networksApi,
    os as osApi,
} from "@/api/server-info-api.ts";
import { getLogger } from "@/plugins/logger.ts";
import { toLogin } from "@/routers";
import { useUserStore } from "@/stores/UserStore.ts";
import { sleep } from "@/utils/util.ts";
import { isBlank, isDefined } from "@/utils/validate.ts";
import { Message } from "@arco-design/web-vue";
import { onUnmounted, ref } from "vue";
import type { ValuesType } from "../types/type.ts";

const logger = getLogger(import.meta.filePath);

type InfoListener = (info: ValuesType) => void;
type ErrorHandler = (reason?: any) => void;

interface ServerInfoReceiver {
    errorHandler: ErrorHandler | null;
    addListener(listener: InfoListener): void;
    setCD(cd: number): void;
    close(): void;
    isOpen(): boolean;
}

class WebSocketServerInfoReceiver implements ServerInfoReceiver {
    errorHandler: ErrorHandler | null;

    private infoListener: Array<InfoListener>;
    private token: string;
    private cd: number;
    private closed: boolean;

    private websocket: WebSocket;

    constructor(token: string, cd: number, errorHandler?: ErrorHandler) {
        this.errorHandler = isDefined(errorHandler) ? errorHandler : null;
        this.infoListener = [];
        this.token = token;
        this.cd = cd;
        this.closed = false;

        const wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
        this.websocket = new WebSocket(`${wsProtocol}//${location.host}/websocket/getServerInfo?token=${token}`);
        this.websocket.addEventListener("open", this.onOpen.bind(this));
        this.websocket.addEventListener("close", this.onClose.bind(this));
        this.websocket.addEventListener("error", this.onError.bind(this));
        this.websocket.addEventListener("message", this.onMessage.bind(this));
    }

    addListener(listener: InfoListener): void {
        if (this.infoListener.includes(listener)) {
            return;
        }
        this.infoListener.push(listener);
    }

    setCD(cd: number): void {
        this.cd = cd;
        this.send(JSON.stringify({ cmd: "start", cd }));
    }

    close(): void {
        if (this.isWSOpen()) {
            this.send(JSON.stringify({ cmd: "stop" }));
            this.websocket.close(1000, "客户端主动关闭");
        }
        this.closed = true;
    }

    isOpen(): boolean {
        return !this.closed;
    }

    private notify(info: ValuesType) {
        for (const listener of this.infoListener) {
            listener(info);
        }
    }

    private onOpen() {
        Message.success({
            id: "WebSocketServerInfoReceiver",
            content: "推送服务接入成功",
            duration: 1000,
        });
        logger.set(import.meta.codeLineNum).info("WebSocket成功接入服务器");
        this.setCD(this.cd);
    }

    private onClose(ev: CloseEvent) {
        this.close();
        Message.success({
            id: "WebSocketServerInfoReceiver",
            content: "推送服务已关闭",
            duration: 1000,
        });
        logger.set(import.meta.codeLineNum).info(`WebSocket连接已关闭(code ${ev.code}: ${ev.reason})`);
        if (ev.code === 3000) {
            toLogin();
        }
    }

    private onError(event: Event) {
        this.close();
        Message.error({
            id: "WebSocketServerInfoReceiver",
            content: "WebSocket连接服务发生错误",
            duration: 1000,
        });
        logger.set(import.meta.codeLineNum).error("WebSocket连接服务发生错误", event);
        if (isDefined(this.errorHandler)) {
            this.errorHandler(event);
        }
    }

    private onMessage(msgEvent: MessageEvent<any>) {
        const values: ValuesType = JSON.parse(msgEvent.data);
        this.notify(values);
    }

    private isWSOpen() {
        return this.websocket.readyState === WebSocket.OPEN;
    }

    private send(msg: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if (this.isWSOpen()) {
            this.websocket.send(msg);
        }
    }
}

class AjaxServerInfoReceiver implements ServerInfoReceiver {
    errorHandler: ErrorHandler | null;

    private infoListener: Array<InfoListener>;
    private cd: number;
    private closed: boolean;

    constructor(cd: number, errorHandler?: ErrorHandler) {
        this.errorHandler = isDefined(errorHandler) ? errorHandler : null;
        this.infoListener = [];
        this.cd = cd;
        this.closed = false;

        this.start();
    }

    addListener(listener: InfoListener): void {
        if (this.infoListener.includes(listener)) {
            return;
        }
        this.infoListener.push(listener);
    }

    setCD(cd: number): void {
        this.cd = cd;
    }

    close(): void {
        this.closed = true;
    }

    isOpen(): boolean {
        return !this.closed;
    }

    private notify(info: ValuesType) {
        for (const listener of this.infoListener) {
            listener(info);
        }
    }

    private start() {
        Message.success({
            id: "AjaxServerInfoReceiver",
            content: "轮询服务启动成功",
            duration: 1000,
        });
        this.getInfo();
    }

    private async getInfo() {
        while (!this.closed) {
            try {
                const values: ValuesType = {
                    cpu: undefined,
                    memory: undefined,
                    networks: [],
                    disks: [],
                    os: undefined,
                };
                const results = await Promise.allSettled([
                    cpuApi().then(resp => {
                        values.cpu = resp;
                    }),
                    memoryApi().then(resp => {
                        values.memory = resp;
                    }),
                    networksApi().then(resp => {
                        values.networks = resp;
                    }),
                    disksApi().then(resp => {
                        values.disks = resp;
                    }),
                    osApi().then(resp => {
                        values.os = resp;
                    }),
                ]);
                for (const result of results) {
                    if (result.status !== "rejected") continue;
                    Message.error({
                        id: "AjaxServerInfoReceiver",
                        content: "Ajax获取信息出错",
                        duration: 1000,
                    });
                    logger.set(import.meta.codeLineNum).error("Ajax获取信息出错", result.reason);
                    if (isDefined(this.errorHandler)) {
                        this.errorHandler(result.reason);
                    }
                }
                this.notify(values);
                await sleep(this.cd);
            } catch (error) {
                logger.set(import.meta.codeLineNum).error("信息获取的循环中出现错误", error);
                if (isDefined(this.errorHandler)) {
                    this.errorHandler(error);
                }
            }
        }
    }
}

export function useServerInfoReceiver(cd: number) {
    const userStore = useUserStore();

    const values = ref<ValuesType>({
        cpu: undefined,
        memory: undefined,
        networks: [],
        disks: [],
        os: undefined,
    });

    const infoListener: InfoListener = info => {
        values.value = info;
    };

    let receiver: ServerInfoReceiver | null = null;

    _initWebSocketServerInfoReceiver();

    function _initWebSocketServerInfoReceiver() {
        close();

        if (isBlank(userStore.token)) {
            _initAjaxServerInfoReceiver();
            return;
        }

        function errorHandler() {
            _initAjaxServerInfoReceiver();
        }

        receiver = new WebSocketServerInfoReceiver(userStore.token, cd, errorHandler);
        receiver.addListener(infoListener);
    }

    function _initAjaxServerInfoReceiver() {
        close();
        receiver = new AjaxServerInfoReceiver(cd);
        receiver.addListener(infoListener);
    }

    function setCD(cd: number) {
        receiver?.setCD(cd);
    }

    function close() {
        if (!isDefined(receiver)) return;

        receiver.close();
        receiver = null;
    }

    onUnmounted(close);

    return {
        values,
        setCD,
        close,
    };
}

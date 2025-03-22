import { eventBus } from "@/plugins/eventBus.ts";
import { getLogger } from "@/plugins/logger.ts";
import type { ValuesType } from "@/types/server-info.ts";
import { isDefined } from "@/utils/validate.ts";
import { Message } from "@arco-design/web-vue";
import type { ErrorHandler, ServerInfoReceiver } from "./type/index.ts";

const logger = getLogger(import.meta.filePath);

export class WSServerInfoReceiver implements ServerInfoReceiver {
    errorHandler: ErrorHandler | null;

    private token: string;
    private cd: number;
    private closed: boolean = false;

    private websocket: WebSocket;

    constructor(token: string, cd: number, errorHandler?: ErrorHandler) {
        this.errorHandler = isDefined(errorHandler) ? errorHandler : null;
        this.token = token;
        this.cd = cd;

        const wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
        this.websocket = new WebSocket(`${wsProtocol}//${location.host}/websocket/getServerInfo?token=${token}`);
        this.websocket.addEventListener("open", this.onOpen.bind(this));
        this.websocket.addEventListener("close", this.onClose.bind(this));
        this.websocket.addEventListener("error", this.onError.bind(this));
        this.websocket.addEventListener("message", this.onMessage.bind(this));
    }

    setCD(cd: number): void {
        this.cd = cd;
        this.send(JSON.stringify({ cmd: "start", cd }));
    }

    close(): void {
        if (this.closed) {
            return;
        }
        if (this.isWSOpen()) {
            this.send(JSON.stringify({ cmd: "stop" }));
            this.websocket.close(1000, "客户端主动关闭");
        }
        this.closed = true;
    }

    isOpen(): boolean {
        return !this.closed;
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
            eventBus.emit("InvalidToken");
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

    private onMessage(msgEvent: MessageEvent<string>) {
        const values: ValuesType = JSON.parse(msgEvent.data);
        eventBus.emit("SIReceiver:update", values);
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

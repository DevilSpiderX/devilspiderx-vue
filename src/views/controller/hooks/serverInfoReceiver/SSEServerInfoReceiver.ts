import { eventBus } from "@/plugins/eventBus.ts";
import { getLogger } from "@/plugins/logger.ts";
import defaultSettings from "@/settings.ts";
import type { ValuesType } from "@/types/server-info.ts";
import { isDefined } from "@/utils/validate.ts";
import { Message } from "@arco-design/web-vue";
import type { ErrorHandler, ServerInfoReceiver } from "./type/index.ts";

const logger = getLogger(import.meta.filePath);

export class SSEServerInfoReceiver implements ServerInfoReceiver {
    errorHandler: ErrorHandler | null;

    private token: string;
    private cd: number;
    private closed: boolean = false;
    private eventSource: EventSource | null = null;
    private abortController: AbortController = new AbortController();

    constructor(token: string, cd: number, errorHandler?: ErrorHandler) {
        this.errorHandler = isDefined(errorHandler) ? errorHandler : null;
        this.token = token;
        this.cd = cd;

        this.initEventSource();
    }

    setCD(cd: number): void {
        this.cd = cd;
        this.initEventSource();
    }

    close(): void {
        if (this.closed) {
            return;
        }
        if (!this.isSSEClose()) {
            this.eventSource?.close();
        }
        this.closed = true;
    }

    isOpen(): boolean {
        return !this.closed;
    }

    private initEventSource() {
        if (isDefined(this.eventSource)) {
            this.abortController.abort();
            this.eventSource.close();
            this.eventSource = null;
        }

        this.abortController = new AbortController();
        const params = new URLSearchParams({
            cd: String(this.cd),
            [defaultSettings.tokenName]: this.token,
        });

        const eventSource = new EventSource(`/api/ServerInfo/sse?${params.toString()}`);
        this.eventSource = eventSource;

        eventSource.addEventListener("error", this.onError.bind(this), { signal: this.abortController.signal });
        eventSource.addEventListener("message", this.onMessage.bind(this), { signal: this.abortController.signal });
        eventSource.addEventListener("notLogin", this.onNotLogin.bind(this), { signal: this.abortController.signal });
    }

    private onError(event: Event) {
        this.close();
        Message.error({
            id: "SSEServerInfoReceiver",
            content: "SSE连接服务发生错误",
            duration: 1000,
        });
        logger.set(import.meta.codeLineNum).error("SSE连接服务发生错误", event);
        if (isDefined(this.errorHandler)) {
            this.errorHandler(event);
        }
    }

    private onMessage(msgEvent: MessageEvent<string>) {
        const values: ValuesType = JSON.parse(msgEvent.data);
        eventBus.emit("SIReceiver:update", values);
    }

    private onNotLogin() {
        this.close();
        eventBus.emit("InvalidToken");
    }

    private isSSEClose(): boolean {
        if (!isDefined(this.eventSource)) {
            return true;
        }

        return this.eventSource.readyState === EventSource.CLOSED;
    }
}

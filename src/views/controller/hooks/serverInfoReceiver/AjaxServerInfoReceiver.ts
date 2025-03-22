import {
    cpu as cpuApi,
    disks as disksApi,
    memory as memoryApi,
    networks as networksApi,
    os as osApi,
} from "@/api/server-info-api.ts";
import { eventBus } from "@/plugins/eventBus.ts";
import { getLogger } from "@/plugins/logger.ts";
import type { ValuesType } from "@/types/server-info.ts";
import { sleep } from "@/utils/util.ts";
import { isDefined } from "@/utils/validate.ts";
import { Message } from "@arco-design/web-vue";
import type { ErrorHandler, ServerInfoReceiver } from "./type/index.ts";

const logger = getLogger(import.meta.filePath);

export class AjaxServerInfoReceiver implements ServerInfoReceiver {
    errorHandler: ErrorHandler | null;

    private cd: number;
    private closed: boolean = false;

    constructor(cd: number, errorHandler?: ErrorHandler) {
        this.errorHandler = isDefined(errorHandler) ? errorHandler : null;
        this.cd = cd;

        this.start();
    }

    setCD(cd: number): void {
        this.cd = cd;
    }

    close(): void {
        if (this.closed) {
            return;
        }
        this.closed = true;
    }

    isOpen(): boolean {
        return !this.closed;
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
        let errorCount = 0;
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
                    errorCount++;
                }
                if (errorCount > 5) {
                    this.close();
                    break;
                }
                eventBus.emit("SIReceiver:update", values);
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

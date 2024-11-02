import type { App } from "vue";

enum LogLevel {
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
}

const COLORS: Record<LogLevel | "NAME", string> = {
    [LogLevel.TRACE]: "#909399",
    [LogLevel.DEBUG]: "#67C23A",
    [LogLevel.INFO]: "#409EFF",
    [LogLevel.WARN]: "#E6A23C",
    [LogLevel.ERROR]: "#F56C6C",
    NAME: "#008B8B",
};

export class Logger {
    private namespace: string;
    private lineNum?: number;

    constructor(namespace: string) {
        this.namespace = namespace;
        this.lineNum = undefined;
    }

    trace(msg: string, ...obj: any[]) {
        console.trace.apply(this, [...this.getArgs(LogLevel.TRACE, msg), ...obj]);
    }

    debug(msg: string, ...obj: any[]) {
        console.debug.apply(this, [...this.getArgs(LogLevel.DEBUG, msg), ...obj]);
    }

    info(msg: string, ...obj: any[]) {
        console.log.apply(this, [...this.getArgs(LogLevel.INFO, msg), ...obj]);
    }

    warn(msg: string, ...obj: any[]) {
        console.warn.apply(this, [...this.getArgs(LogLevel.WARN, msg), ...obj]);
    }

    error(msg: string, ...obj: any[]) {
        console.error.apply(this, [...this.getArgs(LogLevel.ERROR, msg), ...obj]);
    }

    set(lineNum: number): Logger {
        this.lineNum = lineNum;
        return this;
    }

    private getArgs(level: LogLevel, msg: string) {
        const lineNum = this.lineNum;
        this.lineNum = undefined;
        return [
            `${getDate()} %c${LogLevel[level]}%c ---  %c${this.namespace}${getNumStr(lineNum)}%c : ${msg}`,
            `color:${COLORS[level]};`,
            undefined,
            `color:${COLORS.NAME};`,
            undefined,
        ];
    }
}

function getDate(): string {
    const d = new Date();

    const year = d.getFullYear();
    const month = `${d.getMonth()}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");

    const hour = `${d.getHours()}`.padStart(2, "0");
    const minute = `${d.getMinutes()}`.padStart(2, "0");
    const second = `${d.getSeconds()}`.padStart(2, "0");
    const milli = `${d.getMilliseconds()}`.padStart(3, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}.${milli}`;
}

function getNumStr(num?: number): string {
    if (num === undefined) {
        return "";
    }
    return `[${num}]`;
}

export function getLogger(namespace: string): Logger {
    return new Logger(namespace);
}

export default {
    install(app: App) {
        app.config.globalProperties.$getLogger = getLogger;
    },
};

declare module "vue" {
    interface ComponentCustomProperties {
        $getLogger: typeof getLogger;
    }
}

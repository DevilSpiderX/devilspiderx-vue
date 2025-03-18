import { isDefined } from "@/utils/validate.ts";
import type { EventMap, EventName, Listener } from "./types/index.ts";

interface ListenerItem<T extends EventName> {
    listener: Listener<T>;
    signal?: AbortSignal;
    once: boolean;
}

type Events = {
    [K in EventName]?: Array<ListenerItem<K>>;
};

type ErrorHandler = (error: any, event: EventName) => void;

/**
 * 可选参数
 */
export type Options = {
    /**
     * AbortSignal，该 AbortSignal 的 abort() 方法被调用时，监听器会被移除。
     */
    signal?: AbortSignal;
    /**
     * 一个布尔值，表示 listener 在添加之后最多只调用一次。如果为 true，listener 会在其被调用之后自动移除。
     */
    once?: boolean;
};

/**
 * 事件总线
 */
export class EventBus {
    private events: Events;
    private errorHandler?: ErrorHandler;

    /**
     * 初始化事件总线
     */
    constructor();
    /**
     * 初始化事件总线
     *
     * @param errorHandler 错误处理器
     */
    constructor(errorHandler: ErrorHandler);
    constructor(errorHandler?: ErrorHandler) {
        this.events = {};
        this.errorHandler = errorHandler;
    }

    /**
     * 注册事件监听器
     *
     * @param event 事件名
     * @param listener 监听器
     */
    on<T extends EventName>(event: T, listener: Listener<T>): void;
    /**
     * 注册事件监听器
     *
     * @param event 事件名
     * @param listener 监听器
     * @param options 可选参数
     */
    on<T extends EventName>(event: T, listener: Listener<T>, options: Options): void;
    on<T extends EventName>(event: T, listener: Listener<T>, options: Options = {}): void {
        const listenerList = this.find(event);
        if (listenerList.some(({ listener: _listener }) => listener === _listener)) {
            return;
        }

        const signal = options.signal;
        const once = options.once ?? false;
        listenerList.push({ listener, signal, once });

        if (isDefined(signal)) {
            signal.addEventListener("abort", () => {
                this.off(event, listener);
            });
        }
    }

    /**
     * 注销事件监听器
     * @param event 事件名
     * @param listener 要注销的监听器
     */
    off<T extends EventName>(event: T, listener: Listener<T>): void {
        const listenerList = this.find(event);
        const index = listenerList.findIndex(({ listener: _listener }) => listener === _listener);
        if (index === -1) {
            return;
        }
        listenerList.splice(index, 1);
    }

    /**
     * 分发事件
     *
     * @param event 事件名
     */
    emit<T extends EventName>(event: T, ...args: EventMap[T]): void {
        const listenerList = this.find(event).map(item => item);
        listenerList.forEach(item => {
            if (isDefined(item.signal) && item.signal.aborted) {
                return;
            }
            try {
                item.listener(...args);
            } catch (error) {
                if (isDefined(this.errorHandler)) {
                    this.errorHandler(error, event);
                } else {
                    console.error(`Event(${event}) listener execution error`, error);
                }
            } finally {
                if (item.once) {
                    this.off(event, item.listener);
                }
            }
        });
    }

    private find<T extends EventName>(event: T): NonNullable<Events[T]> {
        if (!isDefined(this.events[event])) {
            this.events[event] = [];
        }
        return this.events[event]!;
    }
}

const defaultInstance = new EventBus();

export default defaultInstance;

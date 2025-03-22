import type { ValuesType } from "@/types/server-info.ts";

/**
 * 自定义事件总表
 * 格式：
 *     事件名:[参数名:参数类型,...]
 **/
export type EventMap = {
    InvalidToken: [];
    ClientChange: [width: number, height: number];
    "SIReceiver:update": [values: ValuesType];
};

/**
 * 自定义事件名
 */
export type EventName = keyof EventMap;

/**
 * 自定义事件监听器
 */
export type Listener<T extends EventName> = (...args: EventMap[T]) => void;

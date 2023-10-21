import { MD5 } from "crypto-js";

function sleep(duration: number): Promise<number> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(duration);
        }, duration);
    });
}

function debounce<T extends (...args: any) => any>(callback: T, ms?: number) {
    let timer: NodeJS.Timeout | undefined;
    return function (this: ThisType<T>, ...args: Parameters<T>) {
        if (timer !== undefined) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, ms);
    }
}

function getOnlyID(prefix: string, suffixLength?: number) {
    const _suffix = MD5(prefix + Date.now()).toString();
    let suffix;
    if (suffixLength && suffixLength > 0 && suffixLength <= _suffix.length) {
        suffix = _suffix.substring(0, suffixLength);
    } else {
        suffix = _suffix;
    }
    return `${prefix}-${suffix}`;
}

export { debounce, getOnlyID, sleep };
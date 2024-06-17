import { MD5 } from "crypto-js";

function sleep(duration: number): Promise<number> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(duration);
        }, duration);
    });
}

function debounce<T, U extends (...args: any) => T>(callback: U, ms?: number) {
    let timer: NodeJS.Timeout | undefined;

    function _debounce(this: ThisType<U>, ...args: Parameters<U>): Promise<T> {
        return new Promise((resolve, reject) => {
            if (timer !== undefined) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                try {
                    resolve(callback.apply(this, args));
                } catch (error) {
                    reject(error);
                }
            }, ms);
        });
    }

    _debounce.cancel = () => {
        if (timer !== undefined) {
            clearTimeout(timer);
        }
        timer = undefined;
    };

    return _debounce;
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

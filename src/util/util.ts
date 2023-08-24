function sleep(duration: number): Promise<number> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(duration);
        }, duration);
    });
}

function debounce(callback: Function, ms?: number) {
    let timer: NodeJS.Timeout | undefined;
    return function <T>(this: T, ...args: any) {
        if (timer !== undefined) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, ms);
    }
}

export { debounce, sleep };

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
        console.log(this);

        if (timer !== undefined) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, ms);
    }
}

export { debounce, sleep };

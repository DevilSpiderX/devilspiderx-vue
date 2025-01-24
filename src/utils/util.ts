export function sleep(duration: number): Promise<number> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(duration);
        }, duration);
    });
}

export function debounce<T extends (...args: any) => any>(callback: T, ms: number = 500) {
    let timer: NodeJS.Timeout | undefined;

    const _debounce = (...args: Parameters<T>) => {
        return new Promise<Awaited<ReturnType<T>>>((resolve, reject) => {
            if (timer !== undefined) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                try {
                    resolve(callback.apply(_debounce, args));
                } catch (error) {
                    reject(error);
                }
            }, ms);
        });
    };

    _debounce.cancel = () => {
        if (timer !== undefined) {
            clearTimeout(timer);
        }
        timer = undefined;
    };

    _debounce.immediate = callback;

    return _debounce;
}

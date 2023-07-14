function sleep(duration: number): Promise<number> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(duration);
        }, duration);
    });
}

function debounce(callback: (args: void) => void, ms?: number) {
    let timer: NodeJS.Timeout | undefined;
    return function () {
        if (timer !== undefined) {
            clearTimeout(timer)
        }
        timer = setTimeout(callback, ms);
    }
}

export { debounce, sleep };

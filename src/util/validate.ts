export function isArray<T>(obj: any): obj is Array<T> {
    if (typeof Array.isArray === "undefined") {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
    return Array.isArray(obj);
}

export function isString(obj: any): obj is string {
    return typeof obj === "string" || obj instanceof String;
}

export function isFunction(obj: any): obj is Function {
    return typeof obj === "function";
}

export function isNumber(obj: any): obj is number {
    return typeof obj === "number";
}

export function isDefined<T>(obj: T | undefined | null): obj is T {
    return obj !== undefined && obj !== null;
}

export function isBlank(obj: string | undefined | null): obj is undefined | null | "" {
    if (isDefined(obj)) {
        return obj === "";
    }
    return true;
}

export function isArray(obj: any): obj is Array<any> {
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

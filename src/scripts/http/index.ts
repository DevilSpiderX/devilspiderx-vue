import httpInstance from "./http-instance";

export { httpInstance };
export interface Resp {
    code: number;
    msg: string;
    data: any;
    dataCount?: number;
}

export interface RespType<T> {
    code: number;
    msg: string;
    data: T;
    dataCount?: number;
}
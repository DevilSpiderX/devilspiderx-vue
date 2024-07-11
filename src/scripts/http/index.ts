import httpInstance from "./http-instance";

export { httpInstance };

export type Resp = RespType<any>;

export interface RespType<T> {
    code: number;
    msg: string;
    data: T;
    dataCount?: number;
}

import { httpInstance, Resp } from ".";

export async function start(): Promise<Resp> {
    const resp = await httpInstance.post("/api/admin/v2ray/start");
    return resp.data;
}

export async function stop(): Promise<Resp> {
    const resp = await httpInstance.post("/api/admin/v2ray/stop");
    return resp.data;
}

export async function state(): Promise<Resp> {
    const resp = await httpInstance.post("/api/admin/v2ray/state");
    return resp.data;
}

export async function restartClient(): Promise<Resp> {
    const resp = await httpInstance.post("/api/admin/v2ray/client/restart");
    return resp.data;
}
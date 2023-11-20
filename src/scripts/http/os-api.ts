import { httpInstance, Resp } from ".";

export async function reboot(): Promise<Resp> {
    const resp = await httpInstance.post("/api/admin/os/reboot");
    return resp.data;
}

export async function shutdown(): Promise<Resp> {
    const resp = await httpInstance.post("/api/admin/os/shutdown");
    return resp.data;
}

export async function stop(): Promise<Resp> {
    const resp = await httpInstance.post("/api/admin/service/shutdown");
    return resp.data;
}
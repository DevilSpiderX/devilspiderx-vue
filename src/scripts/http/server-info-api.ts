import { httpInstance, Resp } from ".";

export async function cpu(): Promise<Resp> {
    const resp = await httpInstance.get("/api/ServerInfo/cpu");
    return resp.data;
}

export async function memory(): Promise<Resp> {
    const resp = await httpInstance.get("/api/ServerInfo/memory");
    return resp.data;
}

export async function networks(): Promise<Resp> {
    const resp = await httpInstance.get("/api/ServerInfo/networks");
    return resp.data;
}

export async function disks(): Promise<Resp> {
    const resp = await httpInstance.get("/api/ServerInfo/disks");
    return resp.data;
}

export async function os(): Promise<Resp> {
    const resp = await httpInstance.get("/api/ServerInfo/os");
    return resp.data;
}

export async function token(): Promise<Resp> {
    const resp = await httpInstance.get("/api/ServerInfo/token");
    return resp.data;
}
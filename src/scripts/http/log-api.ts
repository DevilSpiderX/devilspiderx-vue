import { httpInstance, Resp } from ".";

export async function list(): Promise<Resp> {
    const resp = await httpInstance.post("/api/admin/log/list");
    return resp.data;
}

export async function logFile(logName: string): Promise<Resp> {
    const resp = await httpInstance.get(`/api/admin/log/${logName}`);
    return resp.data;
}
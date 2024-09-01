import { httpInstance } from "@/scripts/http";

export async function start(): Promise<number> {
    return httpInstance.post("/api/admin/v2ray/start");
}

export async function stop(): Promise<number> {
    return httpInstance.post("/api/admin/v2ray/stop");
}

export async function state(): Promise<boolean> {
    return httpInstance.post("/api/admin/v2ray/state");
}

export async function restartClient(): Promise<void> {
    return httpInstance.post("/api/admin/v2ray/client/restart");
}

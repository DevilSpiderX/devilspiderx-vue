import httpInstance from "./index.ts";

export async function reboot(): Promise<void> {
    return httpInstance.post("/api/admin/os/reboot");
}

export async function shutdown(): Promise<void> {
    return httpInstance.post("/api/admin/os/shutdown");
}

export async function stop(): Promise<void> {
    return httpInstance.post("/api/admin/service/shutdown");
}

import httpInstance from "./index.ts";

export async function list(): Promise<string[]> {
    return httpInstance.post("/api/admin/log/list");
}

export async function logFile(logName: string): Promise<string> {
    return httpInstance.get(`/api/admin/log/${logName}`, {
        responseType: "text",
    });
}

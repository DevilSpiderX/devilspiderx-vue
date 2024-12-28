import { httpInstance } from "@/scripts/http";
import type { CpuVo, DiskVo, MemoryVo, NetworkVo, OsVo } from "@/types/server-info";

export async function cpu(): Promise<CpuVo> {
    return httpInstance.get("/api/ServerInfo/cpu");
}

export async function memory(): Promise<MemoryVo> {
    return httpInstance.get("/api/ServerInfo/memory");
}

export async function networks(): Promise<NetworkVo[]> {
    return httpInstance.get("/api/ServerInfo/networks");
}

export async function disks(): Promise<DiskVo[]> {
    return httpInstance.get("/api/ServerInfo/disks");
}

export async function os(): Promise<OsVo> {
    return httpInstance.get("/api/ServerInfo/os");
}

import type { CpuVo, DiskVo, MemoryVo, NetworkVo, OsVo } from "@/types/server-info";

export interface ValuesType {
    cpu?: CpuVo;
    memory?: MemoryVo;
    networks?: NetworkVo[];
    disks?: DiskVo[];
    os?: OsVo;
}

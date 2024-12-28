export interface CpuVo {
    name: string;
    physicalNum: number;
    logicalNum: number;
    usedRate: number;
    is64bit: boolean;
    cpuTemperature: number;
}

export interface MemoryVo {
    total: number;
    used: number;
    free: number;
}

export interface NetworkVo {
    name: string;
    displayName: string;
    macAddr: string;
    bytesSent: number;
    bytesRecv: number;
    uploadSpeed: number;
    downloadSpeed: number;
    IPv4addr: string[];
    IPv6addr: string[];
}

export interface DiskVo {
    label: string;
    mount: string;
    fSType: string;
    name: string;
    total: number;
    free: number;
    used: number;
}

export interface OsVo {
    name: string;
    bitness: number;
    processCount: number;
}

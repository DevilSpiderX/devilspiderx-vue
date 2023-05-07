export interface ValuesType {
    cpu?: CpuValueType;
    memory?: MemoryValueType;
    networks?: NetworkValueType[];
    disks?: DiskValueType[];
    os?: OSValueType;
}

export interface CpuValueType {
    name: string;
    physicalNum: number;
    logicalNum: number;
    usedRate: number;
    is64bit: boolean;
    cpuTemperature: number;
}

export interface MemoryValueType {
    total: number;
    used: number;
    free: number;
}

export interface NetworkValueType {
    name: string;
    displayName?: string;
    macAddr?: string;
    bytesSent: number;
    bytesRecv: number;
    uploadSpeed: number;
    downloadSpeed: number;
    IPv4addr?: string[];
    IPv6addr?: string[];
}

export interface DiskValueType {
    label: string;
    mount: string;
    fSType: string;
    name: string;
    total: number;
    free: number;
    used: number;
}

export interface OSValueType {
    bitness: number;
    name: string;
    processCount: number;
}
export interface ValuesType {
    cpu?: CpuValueType;
    memory?: MemoryValueType;
    network?: NetworkValueType;
    disk?: Array<DiskValueType>;
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
    uploadSpeed: number;
    downloadSpeed: number;
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
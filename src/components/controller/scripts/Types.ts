interface CpuValueType {
    name: string,
    physicalNum: number,
    logicalNum: number,
    usedRate: number,
    is64bit: boolean,
    cpuTemperature: number
}

interface MemoryValueType {
    total: number,
    used: number,
    free: number,
    format: {
        total: { value: number, unit: string },
        used: { value: number, unit: string },
        free: { value: number, unit: string }
    }
}

interface NetworkValueType {
    uploadSpeed: number,
    downloadSpeed: number,
    format: {
        uploadSpeed: { value: number, unit: string },
        downloadSpeed: { value: number, unit: string }
    }
}

interface DiskValueType {
    label: string,
    mount: string,
    fSType: string,
    name: string,
    total: number,
    free: number,
    used: number,
    format: {
        total: { value: number, unit: string },
        free: { value: number, unit: string },
        used: { value: number, unit: string }
    }
}

export type { CpuValueType, MemoryValueType, NetworkValueType, DiskValueType }
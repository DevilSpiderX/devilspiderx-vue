export interface Resp {
    code: number,
    msg: string,
    data: any,
    dataCount?: number
}

export interface Http {
    user: {
        login: (uid: string, pwd: string) => Promise<Resp>,
        logout: () => Promise<Resp>,
        register: (uid: string, pwd: string) => Promise<Resp>,
        status: () => Promise<Resp>
    },
    query: {
        get: (key: string) => Promise<Resp>,
        add: (name: string, account: string, password: string, remark: string) => Promise<Resp>,
        update: (id: number, name: string, account: string, password: string, remark: string) => Promise<Resp>,
        delete: (id: number) => Promise<Resp>
    },
    os: {
        reboot: () => Promise<Resp>,
        shutdown: () => Promise<Resp>
    },
    v2ray: {
        start: () => Promise<Resp>,
        stop: () => Promise<Resp>,
        state: () => Promise<Resp>
    },
    serverInfo: {
        cpu: () => Promise<Resp>,
        memory: () => Promise<Resp>,
        network: () => Promise<Resp>,
        disk: () => Promise<Resp>,
        token: () => Promise<Resp>
    },
    log: {
        list: () => Promise<Resp>,
        logFile: (logName: string) => Promise<Resp>
    }
}

declare const http: Http;

export default http;
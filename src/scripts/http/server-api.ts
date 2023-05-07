import httpInstance from './http-instance';

export interface Resp {
    code: number;
    msg: string;
    data: any;
    dataCount?: number;
}

const http = {
    user: {
        async login(uid: string, pwd: string): Promise<Resp> {
            const resp = await httpInstance.post("/api/user/login", { uid, pwd });
            return resp.data;
        },
        async logout(): Promise<Resp> {
            const resp = await httpInstance.post("/api/user/logout");
            return resp.data;
        },
        async register(uid: string, pwd: string): Promise<Resp> {
            const resp = await httpInstance.post("/api/user/register", { uid, pwd });
            return resp.data;
        },
        async status(): Promise<Resp> {
            const resp = await httpInstance.post("/api/user/status");
            return resp.data;
        },
        async updatePassword(oldPassword: string, newPassword: string): Promise<Resp> {
            const resp = await httpInstance.post("/api/user/updatePassword", { oldPassword, newPassword });
            return resp.data;
        },
        async uploadAvatar(imageFile: File): Promise<Resp> {
            const formData = new FormData();
            formData.append("image", imageFile);
            const resp = await httpInstance.post("/api/user/uploadAvatar", formData);
            return resp.data;
        }
    },
    query: {
        async get(key: string): Promise<Resp> {
            const resp = await httpInstance.post("/api/query/get", { key });
            return resp.data;
        },
        async add(name: string, account: string, password: string, remark: string): Promise<Resp> {
            let postBody = {
                name,
                account,
                password,
                remark,
            }
            const resp = await httpInstance.post("/api/query/add", postBody);
            return resp.data;
        },
        async update(id: number, name: string, account: string, password: string, remark: string): Promise<Resp> {
            let postBody = {
                id,
                name,
                account,
                password,
                remark,
            }
            const resp = await httpInstance.post("/api/query/update", postBody);
            return resp.data;
        },
        async delete(id: number): Promise<Resp> {
            const resp = await httpInstance.post("/api/query/delete", { id });
            return resp.data;
        }
    },
    os: {
        async reboot(): Promise<Resp> {
            const resp = await httpInstance.post("/api/admin/os/reboot");
            return resp.data;
        },
        async shutdown(): Promise<Resp> {
            const resp = await httpInstance.post("/api/admin/os/shutdown");
            return resp.data;
        },
        async stop(): Promise<Resp> {
            const resp = await httpInstance.post("/api/admin/service/shutdown");
            return resp.data;
        }
    },
    v2ray: {
        async start(): Promise<Resp> {
            const resp = await httpInstance.post("/api/admin/v2ray/start");
            return resp.data;
        },
        async stop(): Promise<Resp> {
            const resp = await httpInstance.post("/api/admin/v2ray/stop");
            return resp.data;
        },
        async state(): Promise<Resp> {
            const resp = await httpInstance.post("/api/admin/v2ray/state");
            return resp.data;
        }
    },
    serverInfo: {
        async cpu(): Promise<Resp> {
            const resp = await httpInstance.get("/api/ServerInfo/cpu");
            return resp.data;
        },
        async memory(): Promise<Resp> {
            const resp = await httpInstance.get("/api/ServerInfo/memory");
            return resp.data;
        },
        async networks(): Promise<Resp> {
            const resp = await httpInstance.get("/api/ServerInfo/networks");
            return resp.data;
        },
        async disks(): Promise<Resp> {
            const resp = await httpInstance.get("/api/ServerInfo/disks");
            return resp.data;
        },
        async os(): Promise<Resp> {
            const resp = await httpInstance.get("/api/ServerInfo/os");
            return resp.data;
        },
        async token(): Promise<Resp> {
            const resp = await httpInstance.get("/api/ServerInfo/token");
            return resp.data;
        }
    },
    log: {
        async list(): Promise<Resp> {
            const resp = await httpInstance.post("/api/admin/log/list");
            return resp.data;
        },
        async logFile(logName: string): Promise<Resp> {
            const resp = await httpInstance.get(`/api/admin/log/${logName}`);
            return resp.data;
        }
    }
}

export default http;
import httpInstance from './http-instance';

const http = {
    user: {
        async login(uid, pwd) {
            const resp = await httpInstance.post("/api/user/login", { uid, pwd });
            return resp.data;
        },
        async logout() {
            const resp = await httpInstance.post("/api/user/logout");
            return resp.data;
        },
        async register(uid, pwd) {
            const resp = await httpInstance.post("/api/user/register", { uid, pwd });
            return resp.data;
        },
        async status() {
            const resp = await httpInstance.post("/api/user/status");
            return resp;
        }
    },
    query: {
        async get(key) {
            const resp = await httpInstance.post("/api/query/get", { key });
            return resp.data;
        },
        async add(name, account, password, remark) {
            let postBody = {
                name,
                account,
                password,
                remark,
            }
            const resp = await httpInstance.post("/api/query/add", postBody);
            return resp.data;
        },
        async update(id, name, account, password, remark) {
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
        async delete(id) {
            const resp = await httpInstance.post("/api/query/delete", { id });
            return resp.data;
        }
    },
    os: {
        async reboot() {
            const resp = await httpInstance.post("/api/admin/os/reboot");
            return resp.data;
        },
        async shutdown() {
            const resp = await httpInstance.post("/api/admin/os/shutdown");
            return resp.data;
        },
        async stop() {
            const resp = await httpInstance.post("/api/admin/service/shutdown");
            return resp.data;
        }
    },
    v2ray: {
        async start() {
            const resp = await httpInstance.post("/api/admin/v2ray/start");
            return resp.data;
        },
        async stop() {
            const resp = await httpInstance.post("/api/admin/v2ray/stop");
            return resp.data;
        },
        async state() {
            const resp = await httpInstance.post("/api/admin/v2ray/state");
            return resp.data;
        }
    },
    serverInfo: {
        async cpu() {
            const resp = await httpInstance.get("/api/ServerInfo/cpu");
            return resp.data;
        },
        async memory() {
            const resp = await httpInstance.get("/api/ServerInfo/memory");
            return resp.data;
        },
        async network() {
            const resp = await httpInstance.get("/api/ServerInfo/network");
            return resp.data;
        },
        async disk() {
            const resp = await httpInstance.get("/api/ServerInfo/disk");
            return resp.data;
        },
        async os() {
            const resp = await httpInstance.get("/api/ServerInfo/os");
            return resp.data;
        },
        async token() {
            const resp = await httpInstance.get("/api/ServerInfo/token");
            return resp.data;
        }
    },
    log: {
        async list() {
            const resp = await httpInstance.post("/api/admin/log/list");
            return resp.data;
        },
        async logFile(logName) {
            const resp = await httpInstance.get(`/api/admin/log/${logName}`);
            return resp.data;
        }
    }
}

export default http;
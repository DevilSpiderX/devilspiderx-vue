import httpInstance from './http-instance';

const http = {
    user: {
        login(uid, pwd) {
            return httpInstance.post("/api/user/login", { uid, pwd })
                .then(resp => resp.data);
        },
        logout() {
            return httpInstance.post("/api/user/logout")
                .then(resp => resp.data);
        },
        register(uid, pwd) {
            return httpInstance.post("/api/user/register", { uid, pwd })
                .then(resp => resp.data);
        },
        status() {
            return httpInstance.post("/api/user/status")
                .then(resp => resp.data);
        }
    },
    query: {
        get(key) {
            return httpInstance.post("/api/query/get", { key })
                .then(resp => resp.data);
        },
        add(name, account, password, remark) {
            let postBody = {
                name,
                account,
                password,
                remark,
            }
            return httpInstance.post("/api/query/add", postBody)
                .then(resp => resp.data);
        },
        update(id, name, account, password, remark) {
            let postBody = {
                id,
                name,
                account,
                password,
                remark,
            }
            return httpInstance.post("/api/query/update", postBody)
                .then(resp => resp.data);
        },
        delete(id) {
            return httpInstance.post("/api/query/delete", { id })
                .then(resp => resp.data);
        }
    },
    os: {
        reboot() {
            return httpInstance.post("/api/admin/os/reboot")
                .then(resp => resp.data);
        },
        shutdown() {
            return httpInstance.post("/api/admin/os/shutdown")
                .then(resp => resp.data);
        }
    },
    v2ray: {
        start() {
            return httpInstance.post("/api/admin/v2ray/start")
                .then(resp => resp.data);
        },
        stop() {
            return httpInstance.post("/api/admin/v2ray/stop")
                .then(resp => resp.data);
        },
        state() {
            return httpInstance.post("/api/admin/v2ray/state")
                .then(resp => resp.data);
        }
    },
    serverInfo: {
        cpu() {
            return httpInstance.post("/api/ServerInfo/cpu")
                .then(resp => resp.data);
        },
        memory() {
            return httpInstance.post("/api/ServerInfo/memory")
                .then(resp => resp.data);
        },
        network() {
            return httpInstance.post("/api/ServerInfo/network")
                .then(resp => resp.data);
        },
        disk() {
            return httpInstance.post("/api/ServerInfo/disk")
                .then(resp => resp.data);
        },
        token() {
            return httpInstance.post("/api/ServerInfo/token")
                .then(resp => resp.data);
        }
    },
    log: {
        list() {
            return httpInstance.post("/api/admin/log/list")
                .then(resp => resp.data);
        },
        logFile(logName) {
            return httpInstance.get("/api/admin/log/" + logName)
                .then(resp => resp.data);
        }
    }
}

export default http;
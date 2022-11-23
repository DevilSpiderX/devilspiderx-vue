import axios, { AxiosError } from 'axios';

function throwError(error) {
    if (error instanceof AxiosError) {
        error.status = error.response.status
    }
    throw error
}

const http = {
    user: {
        login(uid, pwd) {
            return axios.post("/api/user/login", { uid: uid, pwd: pwd })
                .then(resp => resp.data).catch(error => throwError(error));
        },
        logout() {
            return axios.post("/api/user/logout")
                .then(resp => resp.data).catch(error => throwError(error));
        },
        register(uid, pwd) {
            let postBody = {
                uid: uid,
                pwd: pwd
            }
            return axios.post("/api/user/register", postBody)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        status() {
            return axios.post("/api/user/status")
                .then(resp => resp.data).catch(error => throwError(error));
        }
    },
    query: {
        get(key) {
            let postBody = {
                key: key,
            }
            return axios.post("/api/query/get", postBody)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        add(name, account, password, remark) {
            let postBody = {
                name: name,
                account: account,
                password: password,
                remark: remark,
            }
            return axios.post("/api/query/add", postBody)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        update(id, name, account, password, remark) {
            let postBody = {
                id: id,
                name: name,
                account: account,
                password: password,
                remark: remark,
            }
            return axios.post("/api/query/update", postBody)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        Delete(id) {
            return axios.post("/api/query/delete", { id })
                .then(resp => resp.data).catch(error => throwError(error));
        }
    },
    os: {
        reboot() {
            return axios.post("/api/admin/os/reboot")
                .then(resp => resp.data).catch(error => throwError(error));
        },
        shutdown() {
            return axios.post("/api/admin/os/shutdown")
                .then(resp => resp.data).catch(error => throwError(error));
        }
    },
    v2ray: {
        start() {
            return axios.post("/api/admin/v2ray/start")
                .then(resp => resp.data).catch(error => throwError(error));
        },
        stop() {
            return axios.post("/api/admin/v2ray/stop")
                .then(resp => resp.data).catch(error => throwError(error));
        },
        state() {
            return axios.post("/api/admin/v2ray/state")
                .then(resp => resp.data).catch(error => throwError(error));
        }
    },
    serverInfo: {
        cpu() {
            return axios.post("/api/ServerInfo/cpu")
                .then(resp => resp.data).catch(error => throwError(error));
        },
        memory() {
            return axios.post("/api/ServerInfo/memory")
                .then(resp => resp.data).catch(error => throwError(error));
        },
        network() {
            return axios.post("/api/ServerInfo/network")
                .then(resp => resp.data).catch(error => throwError(error));
        },
        disk() {
            return axios.post("/api/ServerInfo/disk")
                .then(resp => resp.data).catch(error => throwError(error));
        },
        token() {
            return axios.post("/api/ServerInfo/token")
                .then(resp => resp.data).catch(error => throwError(error));
        }
    },
    log: {
        list() {
            return axios.post("/api/admin/log/list")
                .then(resp => resp.data).catch(error => throwError(error));
        },
        logFile(logName) {
            return axios.get("/api/admin/log/" + logName)
                .then(resp => resp.data).catch(error => throwError(error));
        }
    }
}

export default http;
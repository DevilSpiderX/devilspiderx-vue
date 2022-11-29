import axios, { AxiosError } from 'axios';

function throwError(error) {
    if (error instanceof AxiosError) {
        error.status = error.response.status
    }
    throw error
}

function fullAddr(path) {
    return new URL(path, location.origin).href;
}

const addr = {
    user: {
        login: fullAddr("/api/user/login"),
        logout: fullAddr("/api/user/logout"),
        register: fullAddr("/api/user/register"),
        status: fullAddr("/api/user/status")
    },
    query: {
        get: fullAddr("/api/query/get"),
        add: fullAddr("/api/query/add"),
        update: fullAddr("/api/query/update"),
        Delete: fullAddr("/api/query/delete")
    },
    os: {
        reboot: fullAddr("/api/admin/os/reboot"),
        shutdown: fullAddr("/api/admin/os/shutdown")
    },
    v2ray: {
        start: fullAddr("/api/admin/v2ray/start"),
        stop: fullAddr("/api/admin/v2ray/stop"),
        state: fullAddr("/api/admin/v2ray/state"),
    },
    serverInfo: {
        cpu: fullAddr("/api/ServerInfo/cpu"),
        memory: fullAddr("/api/ServerInfo/memory"),
        network: fullAddr("/api/ServerInfo/network"),
        disk: fullAddr("/api/ServerInfo/disk"),
        token: fullAddr("/api/ServerInfo/token"),
    },
    log: {
        list: fullAddr("/api/admin/log/list"),
        logFile: logName => fullAddr("/api/admin/log/" + logName)
    },
}

const http = {
    user: {
        login(uid, pwd) {
            return axios.post(addr.user.login, { uid, pwd })
                .then(resp => resp.data).catch(error => throwError(error));
        },
        logout() {
            return axios.post(addr.user.logout)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        register(uid, pwd) {
            return axios.post(addr.user.register, { uid, pwd })
                .then(resp => resp.data).catch(error => throwError(error));
        },
        status() {
            return axios.post(addr.user.status)
                .then(resp => resp.data).catch(error => throwError(error));
        }
    },
    query: {
        get(key) {
            return axios.post(addr.query.get, { key })
                .then(resp => resp.data).catch(error => throwError(error));
        },
        add(name, account, password, remark) {
            let postBody = {
                name,
                account,
                password,
                remark,
            }
            return axios.post(addr.query.add, postBody)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        update(id, name, account, password, remark) {
            let postBody = {
                id,
                name,
                account,
                password,
                remark,
            }
            return axios.post(addr.query.update, postBody)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        Delete(id) {
            return axios.post(addr.query.delete, { id })
                .then(resp => resp.data).catch(error => throwError(error));
        }
    },
    os: {
        reboot() {
            return axios.post(addr.os.reboot)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        shutdown() {
            return axios.post(addr.os.shutdown)
                .then(resp => resp.data).catch(error => throwError(error));
        }
    },
    v2ray: {
        start() {
            return axios.post(addr.v2ray.start)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        stop() {
            return axios.post(addr.v2ray.stop)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        state() {
            return axios.post(addr.v2ray.state)
                .then(resp => resp.data).catch(error => throwError(error));
        }
    },
    serverInfo: {
        cpu() {
            return axios.post(addr.serverInfo.cpu)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        memory() {
            return axios.post(addr.serverInfo.memory)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        network() {
            return axios.post(addr.serverInfo.network)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        disk() {
            return axios.post(addr.serverInfo.disk)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        token() {
            return axios.post(addr.serverInfo.token)
                .then(resp => resp.data).catch(error => throwError(error));
        }
    },
    log: {
        list() {
            return axios.post(addr.log.list)
                .then(resp => resp.data).catch(error => throwError(error));
        },
        logFile(logName) {
            return axios.get(addr.log.logFile(logName))
                .then(resp => resp.data).catch(error => throwError(error));
        }
    }
}

export default http;
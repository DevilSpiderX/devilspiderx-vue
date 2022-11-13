import axios, { AxiosError } from 'axios';

function throwError(error) {
    if (error instanceof AxiosError) {
        error.status = error.response.status
    }
    throw error
}

function login(uid, pwd) {
    return axios.post("/api/user/login", { uid: uid, pwd: pwd })
        .then(resp => resp.data).catch(error => throwError(error));
}

function logout() {
    return axios.post("/api/user/logout")
        .then(resp => resp.data).catch(error => throwError(error));
}

function register(uid, pwd) {
    let postBody = {
        uid: uid,
        pwd: pwd
    }
    return axios.post("/api/user/register", postBody)
        .then(resp => resp.data).catch(error => throwError(error));
}

function query(key) {
    let postBody = {
        key: key,
    }
    return axios.post("/api/query", postBody)
        .then(resp => resp.data).catch(error => throwError(error));
}

function addPasswords(name, account, password, remark) {
    let postBody = {
        name: name,
        account: account,
        password: password,
        remark: remark,
    }
    return axios.post("/api/addPasswords", postBody)
        .then(resp => resp.data).catch(error => throwError(error));
}

function updatePasswords(id, name, account, password, remark) {
    let postBody = {
        id: id,
        name: name,
        account: account,
        password: password,
        remark: remark,
    }
    return axios.post("/api/updatePasswords", postBody)
        .then(resp => resp.data).catch(error => throwError(error));
}

function os_reboot() {
    return axios.post("/api/os/reboot")
        .then(resp => resp.data).catch(error => throwError(error));
}

function os_shutdown() {
    return axios.post("/api/os/shutdown")
        .then(resp => resp.data).catch(error => throwError(error));
}

function v2rayStart() {
    return axios.post("/api/v2ray/start")
        .then(resp => resp.data).catch(error => throwError(error));
}

function v2rayStop() {
    return axios.post("/api/v2ray/stop")
        .then(resp => resp.data).catch(error => throwError(error));
}

function v2rayState() {
    return axios.post("/api/v2ray/state")
        .then(resp => resp.data).catch(error => throwError(error));
}

function cpu() {
    return axios.post("/api/ServerInfo/cpu")
        .then(resp => resp.data).catch(error => throwError(error));
}

function memory() {
    return axios.post("/api/ServerInfo/memory")
        .then(resp => resp.data).catch(error => throwError(error));
}

function network() {
    return axios.post("/api/ServerInfo/network")
        .then(resp => resp.data).catch(error => throwError(error));
}

function network_size() {
    return axios.post("/api/ServerInfo/network/size")
        .then(resp => resp.data).catch(error => throwError(error));
}

function disk() {
    return axios.post("/api/ServerInfo/disk")
        .then(resp => resp.data).catch(error => throwError(error));
}

function disk_size() {
    return axios.post("/api/ServerInfo/disk/size")
        .then(resp => resp.data).catch(error => throwError(error));
}

function token() {
    return axios.post("/api/ServerInfo/token")
        .then(resp => resp.data).catch(error => throwError(error));
}

function logList() {
    return axios.post("/log")
        .then(resp => resp.data).catch(error => throwError(error));
}

function user_status() {
    return axios.post("/api/user/status")
        .then(resp => resp.data).catch(error => throwError(error));
}


const http = {
    login, logout, register,
    query,
    addPasswords, updatePasswords,
    os_reboot, os_shutdown,
    v2rayStart, v2rayStop, v2rayState,
    cpu,
    memory,
    network, network_size,
    disk, disk_size,
    token,
    logList,
    user_status
}

export default http;
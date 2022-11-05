import axios from 'axios';

async function login(uid, pwd) {
    try {
        let resp = await axios.post("/api/user/login", {uid: uid, pwd: pwd});
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function logout() {
    try {
        let resp = await axios.post("/api/user/logout");
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function register(uid, pwd) {
    let postBody = {
        uid: uid,
        pwd: pwd
    }
    try {
        let resp = await axios.post("/api/user/register", postBody)
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function query(key) {
    let postBody = {
        key: key,
    }
    try {
        let resp = await axios.post("/api/query", postBody)
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function addPasswords(name, account, password, remark) {
    let postBody = {
        name: name,
        account: account,
        password: password,
        remark: remark,
    }
    try {
        let resp = await axios.post("/api/addPasswords", postBody)
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function updatePasswords(id, name, account, password, remark) {
    let postBody = {
        id: id,
        name: name,
        account: account,
        password: password,
        remark: remark,
    }
    try {
        let resp = await axios.post("/api/updatePasswords", postBody)
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function os_reboot() {
    try {
        let resp = await axios.post("/api/os/reboot")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function os_shutdown() {
    try {
        let resp = await axios.post("/api/os/shutdown")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function v2rayStart() {
    try {
        let resp = await axios.post("/api/v2ray/start")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function v2rayStop() {
    try {
        let resp = await axios.post("/api/v2ray/stop")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function v2rayState() {
    try {
        let resp = await axios.post("/api/v2ray/state")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function cpu() {
    try {
        let resp = await axios.post("/api/ServerInfo/cpu")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function memory() {
    try {
        let resp = await axios.post("/api/ServerInfo/memory")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function network() {
    try {
        let resp = await axios.post("/api/ServerInfo/network")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function network_size() {
    try {
        let resp = await axios.post("/api/ServerInfo/network/size")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function disk() {
    try {
        let resp = await axios.post("/api/ServerInfo/disk")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function disk_size() {
    try {
        let resp = await axios.post("/api/ServerInfo/disk/size")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function token() {
    try {
        let resp = await axios.post("/api/ServerInfo/token")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function logList() {
    try {
        let resp = await axios.post("/log")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

async function user_status() {
    try {
        let resp = await axios.post("/api/user/status")
        return Promise.resolve(resp.data);
    } catch (error) {
        return Promise.reject(error);
    }
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
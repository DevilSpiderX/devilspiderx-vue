import axios from 'axios';

export function login(uid, pwd, success, error) {
    axios.post("/api/user/login", {uid: uid, pwd: pwd})
        .then(resp => success(resp.data))
        .catch(error);
}

export function logout(success, error) {
    axios.post("/api/user/logout")
        .then(resp => success(resp.data))
        .catch(error);
}

export function register(uid, pwd, success, error) {
    let postBody = {
        uid: uid,
        pwd: pwd
    }
    axios.post("/api/user/register", postBody)
        .then(resp => success(resp.data))
        .catch(error);
}

export function query(key, page, success, error) {
    let postBody = {
        key: key,
        page: page
    }
    axios.post("/api/query", postBody)
        .then(resp => success(resp.data))
        .catch(error);
}

export function addPasswords(name, account, password, remark, success, error) {
    let postBody = {
        name: name,
        account: account,
        password: password,
        remark: remark,
    }
    axios.post("/api/addPasswords", postBody)
        .then(resp => success(resp.data))
        .catch(error);
}

export function updatePasswords(id, name, account, password, remark, success, error) {
    let postBody = {
        id: id,
        name: name,
        account: account,
        password: password,
        remark: remark,
    }
    axios.post("/api/updatePasswords", postBody)
        .then(resp => success(resp.data))
        .catch(error);
}

export function os_reboot(success, error) {
    axios.post("/api/os/reboot")
        .then(resp => success(resp.data))
        .catch(error);
}

export function os_shutdown(success, error) {
    axios.post("/api/os/shutdown")
        .then(resp => success(resp.data))
        .catch(error);
}

export function v2rayStart(success, error) {
    axios.post("/api/v2ray/start")
        .then(resp => success(resp.data))
        .catch(error);
}

export function v2rayStop(success, error) {
    axios.post("/api/v2ray/stop")
        .then(resp => success(resp.data))
        .catch(error);
}

export function v2rayState(success, error) {
    axios.post("/api/v2ray/state")
        .then(resp => success(resp.data))
        .catch(error);
}

export function cpu(success, error) {
    axios.post("/api/ServerInfo/cpu")
        .then(resp => success(resp.data))
        .catch(error);
}

export function memory(success, error) {
    axios.post("/api/ServerInfo/memory")
        .then(resp => success(resp.data))
        .catch(error);
}

export function network(success, error) {
    axios.post("/api/ServerInfo/network")
        .then(resp => success(resp.data))
        .catch(error);
}

export function network_size(async, success, error) {
    axios.post("/api/ServerInfo/network/size")
        .then(resp => success(resp.data))
        .catch(error);
}

export function disk(success, error) {
    axios.post("/api/ServerInfo/disk")
        .then(resp => success(resp.data))
        .catch(error);
}

export function disk_size(async, success, error) {
    axios.post("/api/ServerInfo/disk/size")
        .then(resp => success(resp.data))
        .catch(error);
}

export function token(success, error) {
    axios.post("/api/ServerInfo/token")
        .then(resp => success(resp.data))
        .catch(error);
}

export function logList(success, error) {
    axios.post("/log")
        .then(resp => success(resp.data))
        .catch(error);
}

export function user_status(success, error) {
    axios.post("/api/user/status")
        .then(resp => success(resp.data))
        .catch(error);
}
import $ from 'jquery';

export function login(uid, pwd, success, error) {
    let postBody = {
        "uid": uid,
        "pwd": pwd
    }
    $.ajax("/api/user/login", {
        type: "POST", data: JSON.stringify(postBody), contentType: "application/json", success: success, error: error
    });
}

export function logout(success, error) {
    $.ajax("/api/user/logout", {type: "POST", success: success, error: error});
}

export function register(uid, pwd, success, error) {
    let postBody = {
        "uid": uid,
        "pwd": pwd
    }
    $.ajax("/api/user/register", {
        type: "POST", data: JSON.stringify(postBody), contentType: "application/json", success: success, error: error
    });
}

export function query(key, success, error) {
    let postBody = {
        "key": key
    }
    $.ajax("/api/query", {
        type: "POST", data: JSON.stringify(postBody), contentType: "application/json", success: success, error: error
    });
}

export function addPasswords(name, account, password, remark, success, error) {
    let postBody = {
        "name": name,
        "account": account,
        "password": password,
        "remark": remark,
    }
    $.ajax("/api/addPasswords", {
        type: "POST", data: JSON.stringify(postBody), contentType: "application/json", success: success, error: error
    });
}

export function updatePasswords(id, name, account, password, remark, success, error) {
    let postBody = {
        "id": id,
        "name": name,
        "account": account,
        "password": password,
        "remark": remark,
    }
    $.ajax("/api/updatePasswords", {
        type: "POST", data: JSON.stringify(postBody), contentType: "application/json", success: success, error: error
    });
}

export function os_reboot(success, error) {
    $.ajax("/api/os/reboot", {
        type: "POST", success: success, error: error
    });
}

export function os_shutdown(success, error) {
    $.ajax("/api/os/shutdown", {
        type: "POST", success: success, error: error
    });
}

export function v2rayStart(success, error) {
    $.ajax("/api/v2ray/start", {
        type: "POST", success: success, error: error
    });
}

export function v2rayStop(success, error) {
    $.ajax("/api/v2ray/stop", {
        type: "POST", success: success, error: error
    });
}

export function v2rayState(success, error) {
    $.ajax("/api/v2ray/state", {
        type: "POST", success: success, error: error
    });
}

export function cpu(success, error) {
    $.ajax("/api/ServerInfo/cpu", {
        type: "POST", success: success, error: error
    });
}

export function memory(success, error) {
    $.ajax("/api/ServerInfo/memory", {
        type: "POST", success: success, error: error
    });
}

export function network(success, error) {
    $.ajax("/api/ServerInfo/network", {
        type: "POST", success: success, error: error
    });
}

export function network_size(async, success, error) {
    $.ajax("/api/ServerInfo/network/size", {
        type: "POST", async: async, success: success, error: error
    });
}

export function disk(success, error) {
    $.ajax("/api/ServerInfo/disk", {
        type: "POST", success: success, error: error
    });
}

export function disk_size(async, success, error) {
    $.ajax("/api/ServerInfo/disk/size", {
        type: "POST", async: async, success: success, error: error
    });
}

export function token(async, success, error) {
    $.ajax("/api/ServerInfo/token", {
        type: "POST", async: async, success: success, error: error
    });
}

export function logList(success, error) {
    $.ajax("/log", {
        type: "POST", success: success, error: error
    });
}

export function user_status(success, error) {
    $.ajax("/api/user/status", {
        type: "POST", success: success, error: error
    });
}
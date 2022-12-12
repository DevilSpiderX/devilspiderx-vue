import axios from "axios";

const httpInstance = axios.create({
    baseURL: location.origin,
    timeout: 10000
});

httpInstance.interceptors.response.use(resp => {
    let code = resp.data.code;
    if (code === 1000) {
        console.error("请求返回错误:", resp.data.msg);
    } else if (code === 1001) {
        console.warn("请求返回警告:", resp.data.msg);
    }
    return resp;
}, error => {
    error.response && (error.status = error.response.status);
    throw error;
});

export default httpInstance;
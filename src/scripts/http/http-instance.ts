import router from '@/router';
import { Message } from "@arco-design/web-vue";
import axios from "axios";

const httpInstance = axios.create({
    baseURL: location.origin,
    timeout: 30000
});

httpInstance.interceptors.response.use(resp => {
    const code = resp.data.code;
    switch (code) {
        case 1000: {
            console.error("请求返回错误:", resp.data.msg);
            break;
        }
        case 1001: {
            console.warn("请求返回警告:", resp.data.msg);
            break;
        }
        case 1002: {
            Message.error({
                id: "resp_code_1002",
                content: "请先登录再试"
            });
            router.push({ name: "login" });
            break;
        }
        case 1003:
        case 1004: {
            Message.error(resp.data.msg);
            break
        }
    }
    return resp;
}, error => {
    if (error && error.response) {
        console.error(error.response.data);
        switch (error.response.status) {
            case 400: {
                Message.error({
                    id: "resp_error_400",
                    content: "400 Bad Request"
                });
                break;
            }
            case 404: {
                Message.error({
                    id: "resp_error_404",
                    content: "404 Not Found"
                });
                break;
            }
            case 405: {
                Message.error({
                    id: "resp_error_405",
                    content: "405 Method Not Allowed"
                });
                break;
            }
            case 500: {
                Message.error({
                    id: "resp_error_500",
                    content: "500 Internal Server Error"
                });
                break;
            }
        }
    }
    return error;
});

export default httpInstance;
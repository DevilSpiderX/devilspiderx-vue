import { eventBus } from "@/plugins/eventBus.ts";
import { getLogger } from "@/plugins/logger";
import defaultSettings from "@/settings.ts";
import { useUserStore } from "@/stores/UserStore.ts";
import { isBlank } from "@/utils/validate.ts";
import { Message } from "@arco-design/web-vue";
import axios, { type InternalAxiosRequestConfig } from "axios";

const logger = getLogger(import.meta.filePath);
const httpInstance = axios.create({
    baseURL: location.origin,
    timeout: 30_000,
});

httpInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const userStore = useUserStore();
        if (!isBlank(userStore.token)) {
            config.headers[defaultSettings.tokenName] = userStore.token;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    },
);

httpInstance.interceptors.response.use(
    resp => {
        if (!resp.data) {
            Promise.reject("返回值为空");
        }
        const { code, msg, data } = resp.data;
        if (code === undefined) {
            return resp.data;
        }
        switch (code) {
            case 0: {
                return data;
            }
            case 1000: {
                logger.set(import.meta.codeLineNum).error(`请求返回错误:${msg}`);
                Message.error(msg ? `Error:${msg}` : "Error");
                return Promise.reject(`请求返回错误:${msg}`);
            }
            case 1001: {
                logger.set(import.meta.codeLineNum).warn(`请求返回警告:${msg}`);
                Message.warning(msg ? `Warning:${msg}` : "Warning");
                return Promise.reject(`请求返回警告:${msg}`);
            }
            case 1002: {
                Message.error({
                    id: "resp_code_1002",
                    content: "当前用户未登录",
                });
                logger.set(import.meta.codeLineNum).error("当前用户未登录");
                eventBus.emit("InvalidToken");
                return Promise.reject(resp.data);
            }
            case 1003:
            case 1004: {
                logger.set(import.meta.codeLineNum).error(`code:${code}, msg:${msg}`);
                Message.error(msg ?? "Error");
                return Promise.reject(resp.data);
            }
            default: {
                logger.set(import.meta.codeLineNum).error(`code:${code}, msg:${msg}`);
                Message.error(msg);
                return Promise.reject(resp.data);
            }
        }
    },
    error => {
        if (import.meta.env.DEV) {
            logger.set(import.meta.codeLineNum).error("HTTP请求出现错误", error);
        }
        if (error && error.response) {
            switch (error.response.status) {
                case 400: {
                    Message.error({
                        id: "resp_error_400",
                        content: "400 Bad Request",
                    });
                    break;
                }
                case 401: {
                    eventBus.emit("InvalidToken");
                    break;
                }
                case 404: {
                    Message.error({
                        id: "resp_error_404",
                        content: "404 Not Found",
                    });
                    break;
                }
                case 405: {
                    Message.error({
                        id: "resp_error_405",
                        content: "405 Method Not Allowed",
                    });
                    break;
                }
                case 500: {
                    Message.error({
                        id: "resp_error_500",
                        content: "500 Internal Server Error",
                    });
                    break;
                }
                default: {
                    Message.error({
                        id: "resp_error_default",
                        content: `Error ${error.response.status}`,
                    });
                    break;
                }
            }
        }
        return Promise.reject(error);
    },
);

export default httpInstance;

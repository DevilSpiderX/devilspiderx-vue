import { BaseException } from "@/error/baseException";
import { eventBus } from "@/plugins/eventBus";
import { getLogger } from "@/plugins/logger";
import defaultSettings from "@/settings";
import { useUserInfoStore } from "@/stores/UserInfo";
import type { CommonResult } from "@/types/commonTypes";
import ResultCode from "@/types/resultCode";
import { isDefined } from "@/utils/validate";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { ElMessage } from "element-plus";

const logger = getLogger(import.meta.filePath);
export const instance = axios.create({
    baseURL: defaultSettings.apiUrl,
    timeout: 30_000,
});

instance.interceptors.request.use(
    config => {
        setReqParamsTimestamp(config);

        const userInfoStore = useUserInfoStore();
        if (isDefined(userInfoStore.token)) {
            config.headers.set(defaultSettings.tokenName, userInfoStore.token);
        }

        return config;
    },
    error => {
        if (import.meta.env.DEV) {
            logger.set(import.meta.codeLineNum).error("HTTP请求出现错误", error);
        }
        return Promise.reject(new BaseException(ResultCode.Error, "HTTP请求出现错误", undefined, error));
    },
);

instance.interceptors.response.use(
    resp => {
        if (!isDefined(resp.data)) {
            return null;
        }
        const { code, msg, data } = resp.data as CommonResult<any>;
        if (code === undefined) {
            return resp.data;
        }
        switch (code) {
            case ResultCode.Success: {
                return data;
            }
            case ResultCode.NotLogin:
            case ResultCode.BeReplaced:
            case ResultCode.KickOut:
            case ResultCode.TokenFreeze: {
                ElMessage.error({
                    message: msg,
                    grouping: true,
                });
                eventBus.emit("InvalidToken");
                break;
            }
            default: {
                logger.set(import.meta.codeLineNum).error(`code:${code}, msg:${msg}`);
                break;
            }
        }
        return Promise.reject(new BaseException(code, msg, data));
    },
    error => {
        if (import.meta.env.DEV) {
            logger.set(import.meta.codeLineNum).error("HTTP请求出现错误", error);
        }
        if (error && error.response) {
            switch (error.response.status) {
                case 400: {
                    ElMessage.error({
                        message: "400 Bad Request",
                        grouping: true,
                    });
                    break;
                }
                case 401: {
                    eventBus.emit("InvalidToken");
                    break;
                }
                case 404: {
                    ElMessage.error({
                        message: "404 Not Found",
                        grouping: true,
                    });
                    break;
                }
                case 405: {
                    ElMessage.error({
                        message: "405 Method Not Allowed",
                        grouping: true,
                    });
                    break;
                }
                case 500: {
                    ElMessage.error({
                        message: "500 Internal Server Error",
                        grouping: true,
                    });
                    break;
                }
                default: {
                    ElMessage.error({
                        message: `Error ${error.response.status}`,
                        grouping: true,
                    });
                    break;
                }
            }
        }
        return Promise.reject(error);
    },
);

function setReqParamsTimestamp(config: InternalAxiosRequestConfig) {
    if (!(config.params instanceof URLSearchParams)) {
        if (isDefined(config.params)) {
            config.params = new URLSearchParams(config.params);
        } else {
            config.params = new URLSearchParams();
        }
    }
    config.params.set("timestamp", Date.now().toString());
}

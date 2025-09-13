import { instance } from "@/api/index";
import type { UserLoginVO, UserStatusVO } from "./types/user";

const urlPrefix = "/api/user";

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 * @returns 登录状态VO
 */
export async function loginApi(username: string, password: string) {
    return instance.post<any, UserLoginVO>(`${urlPrefix}/login`, {
        username,
        password,
    });
}

/**
 * 登出
 */
export async function logoutApi() {
    return instance.post<any, void>(`${urlPrefix}/logout`);
}

/**
 * 注册
 * @param username 用户名
 * @param password 密码
 */
export async function registerApi(username: string, password: string) {
    return instance.post<any, void>(`${urlPrefix}/register`, {
        username,
        password,
    });
}

/**
 * 用户状态
 * @returns 用户状态VO
 */
export async function statusApi() {
    return instance.get<any, UserStatusVO>(`${urlPrefix}/status`);
}

/**
 * 修改密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export async function updatePasswordApi(oldPassword: string, newPassword: string) {
    return instance.post<any, void>(`${urlPrefix}/updatePassword`, {
        oldPassword,
        newPassword,
    });
}

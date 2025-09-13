export interface UserInfo {
    /** 用户id */
    uid: string;

    /** 上一次登录的ip地址 */
    lastLoginAddr?: string;

    /** 是否登录 */
    login: boolean;

    /** 是否管理员 */
    admin: boolean;

    /** 用户的角色列表 */
    roles: string[];

    /** 用户权限列表 */
    permissions: string[];

    /** 用户头像地址 */
    avatar?: string;
}

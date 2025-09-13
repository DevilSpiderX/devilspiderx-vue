/** 登录状态VO */
export interface UserLoginVO {
    /** 用户id */
    uid: string;

    /** token */
    token: string;

    /** 上一次登录的ip地址 */
    lastLoginAddr: string;
}

/** 用户状态VO */
export interface UserStatusVO {
    /** 用户id */
    uid: string;

    /** 是否登录 */
    login: boolean;

    /** 是否管理员 */
    admin: boolean;

    /** 用户的角色列表 */
    roles: string[];

    /** 用户权限列表 */
    permissions: string[];
}

/** 上传用户头像返回VO */
export interface UserAvatarVO {
    /** 用户头像地址 */
    avatar: string;
}

export interface LoginDataVo {
    uid: string;
    admin: boolean;
    roles: string[];
    lastLoginAddr: string;
}

export interface LoginVo {
    status: number;
    reason: string;
    data?: LoginDataVo;
}

export interface RegisterVo {
    status: number;
    reason: string;
}

export interface StatusVo {
    login: boolean;
    admin: boolean;
    uid?: string;
    permissions?: string[];
}

export interface UploadAvatarVo {
    avatar: string;
}

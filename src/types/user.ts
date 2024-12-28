export interface LoginDataVo {
    uid: string;
    token: string;
    admin: boolean;
    roles: string[];
    permissions: string[];
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
    uid?: string;
    login: boolean;
    admin: boolean;
    roles: string[];
    permissions: string[];
}

export interface UploadAvatarVo {
    avatar: string;
}

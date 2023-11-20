import { httpInstance, Resp } from ".";

export async function login(uid: string, pwd: string): Promise<Resp> {
    const resp = await httpInstance.post("/api/user/login", { uid, pwd });
    return resp.data;
}

export async function logout(): Promise<Resp> {
    const resp = await httpInstance.post("/api/user/logout");
    return resp.data;
}

export async function register(uid: string, pwd: string): Promise<Resp> {
    const resp = await httpInstance.post("/api/user/register", { uid, pwd });
    return resp.data;
}

export async function status(): Promise<Resp> {
    const resp = await httpInstance.post("/api/user/status");
    return resp.data;
}

export async function updatePassword(oldPassword: string, newPassword: string): Promise<Resp> {
    const resp = await httpInstance.post("/api/user/updatePassword", { oldPassword, newPassword });
    return resp.data;
}

export async function uploadAvatar(imageFile: File): Promise<Resp> {
    const formData = new FormData();
    formData.append("image", imageFile);
    const resp = await httpInstance.post("/api/user/uploadAvatar", formData);
    return resp.data;
}

export async function getAvatar(): Promise<Resp> {
    const resp = await httpInstance.get("/api/user/avatar");
    return resp.data;
}
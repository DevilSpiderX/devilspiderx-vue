import { httpInstance } from "@/scripts/http";
import type { LoginVo, RegisterVo, StatusVo, UploadAvatarVo } from "@/types/user";

export async function login(uid: string, pwd: string): Promise<LoginVo> {
    return httpInstance.post("/api/user/login", { uid, pwd });
}

export async function logout(): Promise<void> {
    return httpInstance.post("/api/user/logout");
}

export async function register(uid: string, pwd: string): Promise<RegisterVo> {
    return httpInstance.post("/api/user/register", { uid, pwd });
}

export async function status(): Promise<StatusVo> {
    return httpInstance.get("/api/user/status");
}

export async function updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    return httpInstance.post("/api/user/updatePassword", { oldPassword, newPassword });
}

export async function uploadAvatar(imageFile: File): Promise<UploadAvatarVo> {
    const formData = new FormData();
    formData.append("image", imageFile);
    return httpInstance.post("/api/user/uploadAvatar", formData);
}

export async function getAvatar(): Promise<string> {
    return httpInstance.get("/api/user/avatar");
}

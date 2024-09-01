import { httpInstance } from "@/scripts/http";
import type { CommonPage } from "@/types/common-type";
import type { MyPasswordsVo } from "@/types/query";

export async function get(key: string): Promise<MyPasswordsVo[]> {
    return httpInstance.post("/api/query/get", { key });
}

export async function get_paging(key: string, length: number, page: number): Promise<CommonPage<MyPasswordsVo>> {
    return httpInstance.post("/api/query/get_paging", { key, length, page });
}

export async function add(name: string, account: string, password: string, remark: string): Promise<boolean> {
    const postBody = {
        name,
        account,
        password,
        remark,
    };
    return httpInstance.post("/api/query/add", postBody);
}

export async function update(
    id: number,
    name: string,
    account: string,
    password: string,
    remark: string,
): Promise<boolean> {
    const postBody = {
        id,
        name,
        account,
        password,
        remark,
    };
    return httpInstance.post("/api/query/update", postBody);
}

export async function deleteApi(id: number): Promise<boolean> {
    return httpInstance.post("/api/query/delete", { id });
}

import { httpInstance, Resp } from ".";

export async function get(key: string): Promise<Resp> {
    const resp = await httpInstance.post("/api/query/get", { key });
    return resp.data;
}

export async function add(name: string, account: string, password: string, remark: string): Promise<Resp> {
    let postBody = {
        name,
        account,
        password,
        remark,
    }
    const resp = await httpInstance.post("/api/query/add", postBody);
    return resp.data;
}

export async function update(id: number, name: string, account: string, password: string, remark: string): Promise<Resp> {
    let postBody = {
        id,
        name,
        account,
        password,
        remark,
    }
    const resp = await httpInstance.post("/api/query/update", postBody);
    return resp.data;
}

export async function deleteApi(id: number): Promise<Resp> {
    const resp = await httpInstance.post("/api/query/delete", { id });
    return resp.data;
}
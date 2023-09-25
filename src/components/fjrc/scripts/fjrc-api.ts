import { httpInstance, Resp, RespType } from "@/scripts/http";

export interface Topic {
    itemBank: string;
    type: string;
    title: string;
    label: string;
    answer: string;
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
    f: string;
    g: string;
    topicBasis: string;
}

export async function getTopicApi(bank: string, id: number): Promise<RespType<Topic>> {
    const resp = await httpInstance.get("/api/fjrc/topic", {
        params: { bank, id }
    });
    return resp.data;
}

export async function getTopicCountApi(bank: string): Promise<RespType<{
    count: number
}>> {
    const resp = await httpInstance.get("/api/fjrc/count", {
        params: { bank }
    });
    return resp.data;
}

export async function getOnlineCountApi(fingerprint?: string): Promise<RespType<{
    count: number,
    fingerprint: string
}>> {
    const resp = await httpInstance.get("/api/fjrc/onlineCount", {
        params: { fingerprint }
    });
    return resp.data;
}

export async function uploadHistoryApi(key: string, value: string): Promise<Resp> {
    const resp = await httpInstance.post("/api/fjrc/uploadHistory", { key, value });
    return resp.data;
}

export async function downloadHistoryApi(key: string): Promise<RespType<{
    key: string,
    time: Date,
    value: string
}>> {
    const resp = await httpInstance.get("/api/fjrc/downloadHistory", {
        params: { key }
    });
    return resp.data;
}
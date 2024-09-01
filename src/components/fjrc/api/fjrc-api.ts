import { httpInstance } from "@/scripts/http";

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

export function getTopicApi(bank: string, id: number): Promise<Topic> {
    return httpInstance.get("/api/fjrc/topic", {
        params: { bank, id },
    });
}

export function getTopicCountApi(bank: string): Promise<{ count: number }> {
    return httpInstance.get("/api/fjrc/count", {
        params: { bank },
    });
}

export function getOnlineCountApi(fingerprint?: string): Promise<{
    count: number;
    fingerprint: string;
}> {
    return httpInstance.get("/api/fjrc/onlineCount", {
        params: { fingerprint },
    });
}

export function uploadHistoryApi(key: string, value: string): Promise<boolean> {
    return httpInstance.post("/api/fjrc/uploadHistory", { key, value });
}

export function downloadHistoryApi(key: string): Promise<{
    key: string;
    time: Date;
    value: string;
}> {
    return httpInstance.get("/api/fjrc/downloadHistory", {
        params: { key },
    });
}

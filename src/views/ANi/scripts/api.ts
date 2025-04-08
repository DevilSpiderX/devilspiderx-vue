import defaultSettings from "@/settings.ts";
import axios from "axios";

const httpInstance = axios.create({
    baseURL: defaultSettings.apiUrl,
    timeout: 30_000,
});

export async function getXML() {
    const resp = await httpInstance.get<string>("/api/ani/torrent", {
        params: {
            proxy: true,
        },
    });
    return resp.data;
}

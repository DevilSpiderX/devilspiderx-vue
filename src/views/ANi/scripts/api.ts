import axios from "axios";

export async function getXML() {
    const resp = await axios.get<string>("/api/ani/torrent", {
        params: {
            proxy: true
        }
    });
    return resp.data;
}
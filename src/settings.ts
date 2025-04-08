export interface Settings {
    tokenName: string;
    apiUrl: string;
    wsUrl: string;
}

const settings: Settings = {
    tokenName: "DSXSessionId",
    apiUrl: import.meta.env.VITE_APP_API_URL,
    wsUrl: import.meta.env.VITE_APP_WS_URL,
};

export default settings;

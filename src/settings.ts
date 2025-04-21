export interface Settings {
    tokenName: string;
    apiUrl: string;
    wsUrl: string;
    defaultLogName: string;
}

const settings: Settings = {
    tokenName: "DSXSessionId",
    apiUrl: import.meta.env.VITE_APP_API_URL,
    wsUrl: import.meta.env.VITE_APP_WS_URL,
    defaultLogName: "dsx.all.log",
};

export default settings;

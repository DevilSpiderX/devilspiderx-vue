declare namespace http {
    namespace user {
        function login(uid: string, pwd: string): Promise<any>;
        function logout(): Promise<any>;
        function register(uid: string, pwd: string): Promise<any>;
        function status(): Promise<any>;
    }
    namespace query {
        function get(key: string): Promise<any>;
        function add(name: string, account: string, password: string, remark: string): Promise<any>;
        function update(id: number, name: string, account: string, password: string, remark: string): Promise<any>;
        function Delete(id: number): Promise<any>;
    }
    namespace os {
        function reboot(): Promise<any>;
        function shutdown(): Promise<any>;
    }
    namespace v2ray {
        function start(): Promise<any>;
        function stop(): Promise<any>;
        function state(): Promise<any>;
    }
    namespace serverInfo {
        function cpu(): Promise<any>;
        function memory(): Promise<any>;
        function network(): Promise<any>;
        function disk(): Promise<any>;
        function token(): Promise<any>;
    }
    namespace log {
        function list(): Promise<any>;
        function logFile(logName: string): Promise<any>;
    }
}

export default http;
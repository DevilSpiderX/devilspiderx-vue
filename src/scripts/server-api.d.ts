declare namespace http {
    function login(uid: string, pwd: string): Promise<any>;

    function logout(): Promise<any>;

    function register(uid: string, pwd: string): Promise<any>;

    function query(key: string): Promise<any>;

    function addPasswords(name: string, account: string, password: string, remark: string): Promise<any>;

    function updatePasswords(id: number, name: string, account: string, password: string, remark: string): Promise<any>;

    function os_reboot(): Promise<any>;

    function os_shutdown(): Promise<any>;

    function v2rayStart(): Promise<any>;

    function v2rayStop(): Promise<any>;

    function v2rayState(): Promise<any>;

    function cpu(): Promise<any>;

    function memory(): Promise<any>;

    function network(): Promise<any>;

    function network_size(): Promise<any>;

    function disk(): Promise<any>;

    function disk_size(): Promise<any>;

    function token(): Promise<any>;

    function logList(): Promise<any>;

    function user_status(): Promise<any>;
}

export default http;
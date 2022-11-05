declare namespace http {
    async function login(uid: string, pwd: string): Promise<any>;

    async function logout(): Promise<any>;

    async function register(uid: string, pwd: string): Promise<any>;

    async function query(key: string): Promise<any>;

    async function addPasswords(name: string, account: string, password: string, remark: string): Promise<any>;

    async function updatePasswords(id: number, name: string, account: string, password: string, remark: string): Promise<any>;

    async function os_reboot(): Promise<any>;

    async function os_shutdown(): Promise<any>;

    async function v2rayStart(): Promise<any>;

    async function v2rayStop(): Promise<any>;

    async function v2rayState(): Promise<any>;

    async function cpu(): Promise<any>;

    async function memory(): Promise<any>;

    async function network(): Promise<any>;

    async function network_size(): Promise<any>;

    async function disk(): Promise<any>;

    async function disk_size(): Promise<any>;

    async function token(): Promise<any>;

    async function logList(): Promise<any>;

    async function user_status(): Promise<any>;
}
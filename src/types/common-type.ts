export interface AjaxResp<T> {
    code: number;
    msg: string;
    data: T;
}

export interface CommonPage<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}

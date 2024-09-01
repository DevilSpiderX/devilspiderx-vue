export interface CommonPage<T> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}

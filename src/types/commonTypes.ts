/**
 * 通用返回类型
 */
export interface CommonResult<T> {
    /**
     * 业务代码
     */
    code: number;
    /**
     * 消息
     */
    msg: string;
    /**
     * 数据
     */
    data?: T;
}

/**
 * 通用分页类型
 */
export interface CommonPage<T> {
    /**
     * 数据
     */
    records: Array<T>;
    /**
     * 当前页码,第一页为：1
     */
    current: number;
    /**
     * 每页数据数量
     */
    pageSize: number;
    /**
     * 总数据数量
     */
    total: number;
}

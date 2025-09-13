/**
 * 业务基础异常类型
 *
 * @author DevilSpiderX
 */
export class BaseException extends Error {
    /**
     * 业务异常码
     */
    code: number;
    data: any;

    constructor(code: number, message: string, data: any);
    constructor(code: number, message: string, data: any, cause: any);
    constructor(code: number, message: string, data: any, cause?: any) {
        super(message, { cause });
        this.code = code;
        this.data = data;
    }
}

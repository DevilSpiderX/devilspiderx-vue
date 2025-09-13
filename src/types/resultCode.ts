/**
 * 业务代码、基础消息枚举类型
 *
 * @author DevilSpiderX
 */
enum ResultCode {
    // 默认状态码
    /** 未定义异常 */
    Undefined = -1,
    /** ok */
    Success = 0,
    /** error */
    Error = 1,
    /** json解析出错 */
    JacksonUtilError = 2,
    /** 非法参数 */
    IllegalArgument = 3,
    /** 非法状态 */
    IllegalState = 4,
    /** hash加密报错 */
    DigestError = 5,

    // 登录状态码
    /** 未登录 */
    NotLogin = 900,
    /** 被顶下线 */
    BeReplaced = 901,
    /** 被系统踢下线 */
    KickOut = 902,
    /** token已被冻结 */
    TokenFreeze = 903,
    /** 缺失角色 */
    NotRole = 904,
    /** 缺失权限 */
    NotPermission = 905,

    // 用户状态码
    /** 用户名已存在 */
    UserExists = 1000,
    /** 用户不存在 */
    UserNotExists = 1001,
    /** 用户注册失败 */
    UserRegisterFailure = 1002,
    /** 更新最后登录地址失败 */
    UpdateLastAddrFailure = 1003,
    /** 用户密码错误 */
    UserWrongPassword = 1004,
    /** 修改用户密码失败 */
    UpdateUserPasswordFailure = 1005,
    /** 上传头像失败 */
    UploadAvatarFailure = 1006,

    // 密码记录状态码
    /** 密码记录已存在 */
    MyPasswordExists = 1100,
    /** 密码记录不存在 */
    MyPasswordNotExists = 1101,
    /** 密码记录添加失败 */
    MyPasswordAddFailure = 1102,
    /** 密码记录删除失败 */
    MyPasswordDeleteFailure = 1103,
    /** 密码记录更新失败 */
    MyPasswordUpdateFailure = 1104,
}

export default ResultCode;

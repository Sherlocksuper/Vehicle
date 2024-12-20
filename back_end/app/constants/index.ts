export const LOGIN_SUCCESS = "登录成功"
export const LOGIN_FAIL = "用户名或密码错误"
export const SUCCESS_CODE = 0

export const  DELETE_SUCCESS_MSG = '删除成功'
export const  DELETE_FAIL_MSG = '删除失败'

export const  UPDATE_SUCCESS_MSG = '更新成功'
export const  UPDATE_FAIL_MSG = '更新失败'

export const SEARCH_SUCCESS_MSG = '查询成功'
export const WRITE_SUCCESS_MSG = '操作成功'
export const FAIL_CODE = -1
export const SEARCH_FAIL_MSG = "查询失败"
export const WRITE_FAIL_MSG = "操作失败"
export const TOKEN_VALID_CODE = 0 // 有效
export const TOKEN_EXPIRED_CODE = 1 // 过期
export const TOKEN_ILLEGAL_CODE = 2 // 不合法
export const TOKEN_NOTFOUND_CODE = 3 // token不存在
export const TOKEN_USER_HAS_BEEN_DISABLED_CODE = 4 // 用户被禁用
export const TOKEN_USER_HAS_BEEN_DELETED_CODE = 5 // 用户已被删除
export const TOKEN_USER_PASSWORD_HAS_BEEN_CHANGED_CODE = 6 // 用户密码已被修改，请重新登录
export const TOKEN_USER_LOGOUT = 7 // 用户退出登录
export const TOKEN_INNER_ERROR_CODE = 8 // 服务器内部错误
export const TOKEN_MSG = [
    'TOKEN_VALID:token有效',
    'TOKEN_EXPIRED:token过期',
    'TOKEN_ILLEGAL:token不合法',
    'TOKEN_NOTFOUND:token不存在',
    'TOKEN_USER_HAS_BEEN_DISABLED:用户已经被禁用，token失效',
    'TOKEN_USER_HAS_BEEN_DELETED:该用户已被管理员删除',
    'TOKEN_USER_PASSWORD_HAS_BEEN_CHANGED:用户密码已被修改，请重新登录',
    'TOKEN_USER_LOGOUT:用户已退出登录，原token失效',
    'TOKEN_INNER_ERROR:服务器内部错误'
]
export const QUERY_INCOMPLETENESS = 'query参数不完整'
export const BODY_INCOMPLETENESS = 'body参数不完整'
export const HORIZONTAL_OVERREACH_IS_PROHIBITED = '禁止水平越权'
export const INSUFFICIENT_AUTHORITY = '非法用户'
export const USER_EXISTED = '该用户已存在'
export const USER_UNEXIST = '此用户不存在'
export const HAS_BEEN_DISABLED = '此用户已处于禁用状态，请勿重复操作'
export const HAS_BEEN_START = '此用户已处于启用状态，请勿重复操作'
export const PLEASE_BAN_FIRST = '此用户正处于启用状态，请先将其禁用'
export const SEARCH_NO_DATA = '查无此数据'
export const DEVICE_CONFIG_FILE_NAME = '测试预配置文件.xlsx'
export const CONTROLLER_WORKSHEET = '核心板卡描述'
export const COLLECTOR_WORKSHEET = '采集板卡描述'
export const SIGNAL_WORKSHEET = '采集板卡信号描述'
export const USER_UN_SENT = '该用户暂未下发测试配置文件'

import {Context} from "koa"
import tokenUtils from "../../utils/token";
import {
    FAIL_CODE,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    SUCCESS_CODE,
    WRITE_FAIL_MSG,
    WRITE_SUCCESS_MSG
} from '../constants'
import {IResBody} from "../types";
import UserService from "../service/UserService";
import TokenBlackListService from "../service/TokenBlackListService";

class UserController {
    // 用户登录
    async login(ctx: Context) {
        const {username, password} = ctx.request.body as any
        const res = await UserService.findUserByUsernameAndPassword({username, password})

      // 如果res存在，生成refreshTokne并且放到httpOnly的cookie中
        res && ctx.cookies.set('refreshToken', tokenUtils.generateRefreshToken({
            userId: res.id!,
            username: res.username,
        }), {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        })


        res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: LOGIN_SUCCESS,
            data: {
                username: res.username,
                isRootUser: res.root_user_id === null,
                userId: res.id,
                accessToken: tokenUtils.generateAccessToken({
                    userId: res.id!,
                    username: res.username,
                }),
                disabled: res.disabled
            }
        })
        !res && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: LOGIN_FAIL,
            data: null
        })
    }

    // 登出
    async logout(ctx: Context) {
        const token = ctx.header.authorization
        const f1 = await TokenBlackListService.addToken2BlackList(token!)
        const f2 = await TokenBlackListService.deleteExpiredToken()
        ;(f1 && f2) && ((ctx.body as IResBody) = {
            code: SUCCESS_CODE,
            msg: WRITE_SUCCESS_MSG,
            data: null
        })
        ;!(f1 && f2) && ((ctx.body as IResBody) = {
            code: FAIL_CODE,
            msg: WRITE_FAIL_MSG,
            data: null
        })
    }
}

export default new UserController

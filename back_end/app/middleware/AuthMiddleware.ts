import { Context, Next } from 'koa'
import tokenUtils from '../../utils/token'
import {TOKEN_NOTFOUND_CODE } from '../constants'

async function AuthMiddleware(ctx: Context, next: Next) {
    if (ctx.path === '/login') {
        return next()
    }

    const accessToken = ctx.headers['authorization'] as string
    const refreshToken = ctx.cookies.get('refreshToken') as string

    console.log(ctx.header)
    console.log(accessToken)
    console.log(refreshToken)

    // 如果accessToken不存在，返回错误信息
    if (!accessToken) {
        ctx.body = {
            code: TOKEN_NOTFOUND_CODE,
            msg:  "请重新登录",
            data: null
        }
        return
    }

    // 验证accessToken
    const verifyResult = tokenUtils.verifyAccessToken(accessToken)
    console.log("验证verifyResult",verifyResult)
    if (verifyResult) {
        return next()
    }

    // 验证refreshToken
    const refreshTokenVerifyResult = tokenUtils.verifyRefreshToken(refreshToken)
    console.log("验证refreshTokenVerifyResult", refreshTokenVerifyResult)
    if (!refreshTokenVerifyResult) {
        ctx.body = {
            code: TOKEN_NOTFOUND_CODE,
            msg: "请重新登录",
            data: null
        }
        return
    }

    console.log("refreshTokenVerifyResult", refreshTokenVerifyResult)

    // 刷新accessToken
    const newAccessToken = tokenUtils.generateAccessToken({
        userId: 0,
        username: 'root'
    })

    // 将新的accessToken放入header
    ctx.set('accessToken', newAccessToken)

    return next()
}

export default AuthMiddleware

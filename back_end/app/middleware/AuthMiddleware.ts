import { Context, Next } from 'koa'
import tokenUtils from '../../utils/token'
import { TOKEN_MSG, TOKEN_NOTFOUND_CODE } from '../constants'

async function AuthMiddleware(ctx: Context, next: Next) {
    const accessToken = ctx.headers['accessToken']
    // 获取cookie里的refreshtoken
    const refreshToken = ctx.cookies.get('refreshToken')


    return next()
}

export default AuthMiddleware

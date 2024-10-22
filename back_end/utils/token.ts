import jwt from 'jsonwebtoken'
// 秘钥
const ACCESS_TOKEN_SECRET = 'your_access_token_secret';
const REFRESH_TOKEN_SECRET = 'your_refresh_token_secret';

// 规定access token 15分钟过期，refresh token 7天过期
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // 访问 token 有效期
const REFRESH_TOKEN_EXPIRES_IN = '7d'; // 刷新 token 有效期

// 生成访问 token
const generateAccessToken = (user:{
    userId: number
    username: string
}) => {
    return jwt.sign({ userId: user.userId, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

// 生成刷新 token
const generateRefreshToken = (user: {
    userId: number
    username: string
}) => {
    return jwt.sign({ userId: user.userId, username: user.username }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};

// 验证访问 token
const verifyAccessToken = (token:string) => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
};

// 验证刷新 token
const verifyRefreshToken = (token:string) => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (err) {
        return null;
    }
};

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path";
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();
const apiUrl = process.env.VITE_SERVER_API_URL;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "src"),
        }
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        proxy: {
            '^/api': {
                target: apiUrl, //目标源，目标服务器，真实请求地址
                changeOrigin: true, //支持跨域
                rewrite: (path) => path.replace(/^\/api/, ""), //重写真实路径,替换/api
            }
        }
    }
})

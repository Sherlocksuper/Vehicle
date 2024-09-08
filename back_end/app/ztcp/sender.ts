import * as net from "net";

const PORT = process.env.LONG_PORT ? parseInt(process.env.LONG_PORT) : 9001;
const HOST = process.env.LONG_HOST ? process.env.LONG_HOST : "localhost";
const LOCAL_TCP_PORT = process.env.LOCAL_TCP_PORT ? parseInt(process.env.LOCAL_TCP_PORT) : 2889;


let client: net.Socket;
let reconnectDelay = 1000; // 初始重连延迟时间，单位为毫秒

// 创建并连接到服务器
export function createConnectionToLong() {
    client = new net.Socket();

    client.connect({
        port: PORT,
        host: HOST,
        localPort: LOCAL_TCP_PORT
    }, () => {
        console.log('已连接到服务器，作为客户端 Computer');
        reconnectDelay = 1000; // 重置重连延迟时间
    });

    // 接收服务器和 Board 的消息
    client.on('data', (data: Buffer) => {
        console.log('收到消息: ' + data.toString());
    });

    // 处理连接关闭
    client.on('close', () => {
        console.log('连接已关闭');
    });

    // 处理错误
    client.on('error', (err: Error) => {
        console.error('连接出错:', err.message);
        client.destroy(); // 销毁当前连接，防止意外复用
        attemptReconnect();
    });
}

// 尝试重新连接
export function attemptReconnect() {
    console.log(`将在 ${reconnectDelay / 1000} 秒后尝试重新连接...`);
    setTimeout(() => {
        reconnectDelay = Math.min(reconnectDelay * 2, 10000); // 指数级增长，最大延迟10秒
        createConnectionToLong();
    }, reconnectDelay);
}

// 发送数据到服务器
export function sendToLong(data: any) {
    if (client && !client.destroyed) {
        client.write(JSON.stringify(data));
    } else {
        return "龙芯服务器未启动"
    }
}

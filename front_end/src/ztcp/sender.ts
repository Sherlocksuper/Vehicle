// 假设 localConfig 已经定义并包含了需要的配置

import {BASE_URL} from "@/apis/url/myUrl.ts";

let reconnectDelay = 1000; // 初始重连延迟时间，单位为毫秒
let socket;

// 创建并连接到服务器
export function createMessageChannel() {
    socket = new WebSocket(`ws://${BASE_URL}`);

    socket.onopen = () => {
        console.log('已连接到服务器，作为客户端 Computer 前端');
        reconnectDelay = 1000; // 重置重连延迟时间
    };

    // 接收服务器的消息
    socket.onmessage = (event) => {
        console.log('收到消息: ' + event.data);
    };

    // 处理连接关闭
    socket.onclose = () => {
        console.log('连接已关闭');
        attemptReconnect();
    };

    // 处理错误
    socket.onerror = (error) => {
        console.error('连接出错:', error);
        socket.close(); // 关闭连接
        attemptReconnect();
    };
}

export function cleanConnection() {
    if (socket) {
        socket.close();
    }
}

// 尝试重新连接
export function attemptReconnect() {
    console.log(`将在 ${reconnectDelay / 1000} 秒后尝试重新连接...`);
    setTimeout(() => {
        reconnectDelay = Math.min(reconnectDelay * 2, 10000); // 指数级增长，最大延迟10秒
        createMessageChannel();
    }, reconnectDelay);
}

// 用于发送消息到服务器的函数
export function sendMessage(message) {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.error('WebSocket 连接未打开，无法发送消息');
    }
}

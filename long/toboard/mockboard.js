import * as net from "net";
import {longServerPort} from "../public/config.js";

const client = new net.Socket();

client.connect(longServerPort, '127.0.0.1', () => {
  console.log('已连接到服务器，作为客户端 Board');
  client.write('Hello from Board');
});

// 接收服务器和 Computer 的消息
client.on('data', (data) => {
  console.log('收到消息: ' + data);
});

// 处理连接结束
client.on('close', () => {
  console.log('连接已关闭');
});


// 允许在客户端控制台输入消息发送到服务器
const stdin = process.openStdin();
stdin.addListener("data", function (d) {
  const message = d.toString().trim();
  client.write(message);
});

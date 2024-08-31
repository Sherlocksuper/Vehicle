import {createServer} from "net"
import {longServerPort} from "./config.js";

// 存储两个客户端的套接字
// 上位机
let clientComputer = null;
// 下位机
let clientBoard = null;

const server = createServer((socket) => {
  // 确定客户端是 A 还是 B
  socket.on('data', (data) => {
    const message = data.toString().trim();

    // 初次连接时判断是 A 还是 B
    if (!clientComputer) {
      clientComputer = socket;
      console.log('客户端 A 已连接');
      clientComputer.write('你是客户端 A\n');
    } else if (!clientBoard) {
      clientBoard = socket;
      console.log('客户端 B 已连接');
      clientBoard.write('你是客户端 B\n');
    }

    // 转发消息
    if (socket === clientComputer && clientBoard) {
      console.log(`上位机Computer 发来消息: ${message}`);
      clientBoard.write(`Computer: ${message}\n`);
    } else if (socket === clientBoard && clientComputer) {
      console.log(`下位机Board 发来消息: ${message}`);
      clientComputer.write(`Board: ${message}\n`);
    }
  });

  // 处理客户端断开连接
  socket.on('end', () => {
    if (socket === clientComputer) {
      console.log('Computer上位机 已断开连接');
      clientComputer = null;
    } else if (socket === clientBoard) {
      console.log('Board下位机 已断开连接');
      clientBoard = null;
    }
  });
});

// 监听端口 3000
server.listen(longServerPort, () => {
  console.log('TCP 服务器已启动，正在监听端口 ', longServerPort);
});

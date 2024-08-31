import {createServer,} from "net";
import {boardPort, comPort, longServerPort} from "./config.js";
import {handleReceiveComMessage} from "../tocom/computerMessageHandler.js";
import {clientBoard, clientComputer} from "./index.js";
import {handleReceiveBoardMessage} from "../toboard/boardMessageHandler.js";

function setSocket(socket) {
  if (socket.remotePort === comPort) {
    if (clientComputer) {
      clientComputer.destroy(); // 关闭之前的连接
    }
    clientComputer = socket;
    console.log('上位机 Computer 已连接');
  } else if (socket.remotePort === boardPort) {
    if (clientBoard) {
      clientBoard.destroy(); // 关闭之前的连接
    }
    clientBoard = socket;
    console.log('下位机 Board 已连接');
  }
}

// 创建TCP服务器
const server = createServer((socket) => {
  console.log(`新连接: ${socket.remoteAddress}:${socket.remotePort}`);

  if (socket.remotePort !== comPort && socket.remotePort !== boardPort) {
    console.log("未识别的客户端，来自:", socket.remoteAddress, socket.remotePort);
    socket.write("未识别的客户端，请断开连接\n");
    return;
  }

  setSocket(socket);

  // 确定客户端是 Computer 还是 Board
  socket.on('data', (data) => {
    if (!clientBoard || !clientComputer) {
      socket.write("程序连接不完备，缺少Board或Computer\n");
      return;
    }
    const message = data.toString().trim();
    // 处理消息
    if (socket === clientComputer && clientBoard) {
      console.log(`上位机 Computer 发来消息: ${message}`);
      handleReceiveComMessage(socket, message)
    } else if (socket === clientBoard && clientComputer) {
      console.log(`下位机 Board 发来消息: ${message}`);
      handleReceiveBoardMessage(socket, message)
    }
  });

  // 处理客户端断开连接
  socket.on('end', () => {
    if (socket === clientComputer) {
      console.log('上位机 Computer 已断开连接');
      clientComputer = null;
    } else if (socket === clientBoard) {
      console.log('下位机 Board 已断开连接');
      clientBoard = null;
    }
  });

  // 处理连接错误
  socket.on('error', (err) => {
    console.error(`连接错误 (${socket.remoteAddress}:${socket.remotePort}):`, err.message);
  });
});

// 处理服务器错误
server.on('error', (err) => {
  console.error('服务器错误:', err.message);
  // 根据需要处理错误，如重启服务器或发送警告
});

// 监听端口
server.listen(longServerPort, () => {
  console.log('TCP 服务器已启动，正在监听端口', longServerPort);
});

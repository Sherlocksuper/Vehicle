/**
 * 本文件用来处理上位机发送给龙芯开发板的消息
 * 分为start_collect开始采集和stop_collect停止采集
 */

import {currentCollectConfig, setCurrentCollectConfig} from "../public/index.js";
import {generateHistoryData} from "../public/mockBoardData.js";
import {comFrontPort} from "../public/config.js";

// 定义消息类型枚举
const LongMessage = {
  STARTCOLLECT: "start_collect",
  STOPCOLLECT: "stop_collect",
};

// 处理上位机传来的消息
function handleReceiveComMessage(socket, message) {
  message = JSON.parse(message)
  switch (message.type) {
    case LongMessage.STARTCOLLECT:
      // 处理开始采集的逻辑
      console.log('收到上位机开始采集指令');
      startCollect(socket, message.body);
      break;
    case LongMessage.STOPCOLLECT:
      // 处理停止采集的逻辑
      console.log('收到上位机停止采集指令');
      stopCollect(socket, message.body);
      break;
    default:
      console.log('收到未知类型的消息:', message.type);
      handleUnknownMessage(socket, message);
      break;
  }
}

let historyDataFunction = {
  start: () => {
  },
  stop: () => {
  },
  getHistory: () => {
  },
}

// 开始采集的处理函数
function startCollect(socket, body) {
  if (typeof body !== "object") {
    body = JSON.parse(body)
  }
  // 处理 body 内容
  setCurrentCollectConfig(body)

  // historyDataFunction = generateHistoryData(currentCollectConfig, 2000, 2000, (data) => {
  //   socket.write(JSON.stringify(data) + '\n');
  // })

  // 每2s发送一条消息

  setInterval(() => {
    socket.write("随机消息" + '\n');
  }, 2000)


  // 发送确认或其他响应给上位机
  socket.write('开始采集已接收\n');

  // 开始采集
  // historyDataFunction.start()
}

// 停止采集的处理函数
function stopCollect(socket, body) {
  // 处理 body 内容
  setCurrentCollectConfig(null)

  // 发送确认或其他响应给上位机
  socket.write('停止采集已接收\n');

  // 停止采集
  historyDataFunction.stop()
}

// 处理未知类型的消息
function handleUnknownMessage(socket, message) {
  console.log('处理未知消息类型，消息内容:', message);
  // 可以选择发送错误消息或其他响应
  socket.write('未知消息类型\n');
}


export {handleReceiveComMessage};

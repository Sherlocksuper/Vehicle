import net from "node:net";
import {decodingBoardMessage, decodingBoardMessageWithMap} from "../../utils/BoardUtil/decoding";
import {sendMessageToFront} from "./toFront";
import TestConfigService from "../service/TestConfig";

let client: net.Socket;
let reconnectInterval = 5000; // 重连间隔 5 秒
let isManuallyClosed = false; // 是否主动断开

const mapToJson = (map: Map<string, number>) => {
  const obj: { [key: string]: number } = {};
  map.forEach((value, key) => {
    obj[key] = value;
  })
  return JSON.stringify(obj);
}

// 创建 TCP 客户端并处理连接、断开、重连等逻辑
export const connectWithBoard = (port: number, host: string) => {
  return new Promise<void>((resolve, reject) => {
    client = net.connect({
        port,
        host,
      }, () => {
        console.log(port, host, "建立鏈接成功")
        // @ts-ignore
        client.on('data', (data) => {
          // 1/ 解析数据,这里获得IReceiveData
          const message = decodingBoardMessage(data);
          // 2. 解析数据，这里把IReceiveData转换为Map<string, number>,每个string（signalId）对应他的value值
          const result = decodingBoardMessageWithMap(message);
          // 3. 把message推入CurrentReceiveData，之后留作处理
          TestConfigService.pushReceiveData(message);

          console.log("decodingBoardMessageWith Map result ", result)

          // TODO 获取message的key值
          sendMessageToFront({
            type: 'DATA',
            message: mapToJson(result)
          });
        });

        client.on('end', () => {
          console.log('Connection ended');
          if (!isManuallyClosed) {
            setTimeout(() => {
              reconnectWithBoard(port, host);
            }, reconnectInterval);
          }
        });

        client.on('error', (err) => {
          console.log('Connection error: ' + err)
          sendMessageToFront({
            type: 'NOTIFICATION',
            message: '连接下位机失败: ' + err
          })
          client.end();
          reject(err);
        });

        isManuallyClosed = false;
        resolve();
      }
    );
  })
}

// 重连逻辑
export const reconnectWithBoard = (port: number, host: string) => {
  if (!isManuallyClosed) {
    sendMessageToFront({
      type: 'NOTIFICATION',
      message: '正在尝试与下位机重新连接...'
    })
    connectWithBoard(port, host);
  }
}

// 主动断开连接
export const disconnectWithBoard = () => {
  isManuallyClosed = true;
  if (client) {
    client.end(); // 结束连接
    console.log('Connection closed manually');
  }
}

// 发送消息
export const sendMessageToBoard = (message: Buffer) => {
  if (client && client.writable) {
    client.write(message);
    console.log("send to board")
    console.log(message);
  } else {
    console.log('Cannot send message. Client not connected.');
  }
}

// 发送多条消息，并设置间隔时间
export const sendMultipleMessagesBoard = (messages: Buffer[], interval = 1000) => {
  let index = 0;

  return new Promise<void>((resolve) => {
    function sendNextMessage() {
      if (index < messages.length) {
        sendMessageToBoard(messages[index]);
        index++;
        setTimeout(sendNextMessage, interval); // 递归设置下一条消息的发送时间
        console.log("發送了", index)
      } else {
        resolve(); // 所有消息发送完毕，解析Promise
      }
    }

    sendNextMessage();
  });
}

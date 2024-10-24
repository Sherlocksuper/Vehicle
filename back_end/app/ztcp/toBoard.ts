import net from "node:net";
import {decodingBoardMessage, decodingBoardMessageWithMap, IReceiveData, splitBufferByDelimiter} from "../../utils/BoardUtil/decoding";
import {IFrontMessage, sendMessageToFront} from "./toFront";
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

// 定义一个递归函数来遍历host和port数组
export const connectWithMultipleBoards = (hostPortList: Array<{ host: string, port: number }>, index = 0) => {
  isManuallyClosed = false
  return new Promise<void>((resolve, reject) => {
    if (index >= hostPortList.length) {
      reject(new Error('所有的连接尝试均失败'));
      return;
    }

    const {host, port} = hostPortList[index];

    console.log(`尝试连接: ${host}:${port}`);

    let isTimeout = false;
    const timeOut = setTimeout(() => {
      client.end();
      isTimeout = true;
      reject(new Error('连接超时'));
    }, 5000);

    client = net.connect({
      port,
      host,
    }, () => {
      console.log(`${port} ${host} 建立链接成功`);
      clearTimeout(timeOut);
      resolve();
    });

    client.on('data', (data) => {
      try {
        // 1. 解析数据,
        const datas = splitBufferByDelimiter(data, Buffer.from([0xcd, 0xef]));
        const messages: IReceiveData[] = []
        datas.forEach((item) => {
          console.log(item)
          messages.push(decodingBoardMessage(item))
        })

        const resolveMessage = (message: IReceiveData) => {
          const result = decodingBoardMessageWithMap(message);

          console.log("decodingBoardMessageWith Map result ", result);
          const msg = mapToJson(result);

          TestConfigService.pushDataToCurrentHistory({
            time: new Date().getTime(),
            data: JSON.parse(msg)
          })

          // 发送消息给前端
          sendMessageToFront({
            type: 'DATA',
            message: mapToJson(result)
          });
        }

        messages.forEach((message) => {
          resolveMessage(message)
        })
      } catch (e) {
        console.log("这里出错了")
      }
    });

    client.on('end', () => {
      console.log('连接已结束');
      if (!isManuallyClosed) {
        setTimeout(() => {
          reconnectWithMultipleBoards(hostPortList, index);
        }, reconnectInterval);
      }
    });

    client.on('error', (err) => {
      console.log(`连接错误: ${err.message}`, `中断类型`, isManuallyClosed ? '手动' : '被动');

      // 如果client已经end，就不需要重连了
      if (isTimeout) {
        console.log("client 已经超时，不再重连")
        return;
      }

      if (!isManuallyClosed) {
        console.log('尝试下一个连接', 'ip:', hostPortList[index].host, 'port:', hostPortList[index].port);
        connectWithMultipleBoards(hostPortList, index + 1)
          .then(resolve)
          .catch(reject);
      } else {
        client.end();
        reject(err);
      }
    });
  });
};

// 重连逻辑，使用相同的数组
export const reconnectWithMultipleBoards = async (hostPortList: Array<{ host: string, port: number }>, index = 0) => {
  if (!isManuallyClosed) {
    console.log("重连中");
    sendMessageToFront({
      type: 'NOTIFICATION',
      message: '正在尝试与下位机重新连接...'
    });
    await connectWithMultipleBoards(hostPortList, index);
  } else {
    console.log("不重连");
  }
};


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
        try {
          sendMessageToBoard(messages[index]);
          index++;
          setTimeout(sendNextMessage, interval); // 递归设置下一条消息的发送时间
          console.log("發送了", index)
        } catch (e) {
          console.log("發送出錯了", e)
        }
      } else {
        resolve(); // 所有消息发送完毕，解析Promise
      }
    }

    sendNextMessage();
  });
}

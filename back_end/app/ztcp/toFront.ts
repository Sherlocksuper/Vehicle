// @ts-ignore
import WebSocket from 'app/ztcp/toFront';
import TestConfigService from "../service/TestConfig";

export let webSockets: Set<WebSocket> = new Set()

export interface IFrontMessage {
  type: "NOTIFICATION" | "DATA"
  message: string | Buffer
}

export const addWebSocket = (ws: WebSocket) => {
  webSockets.add(ws)
}

export const removeWebSocket = (ws: WebSocket) => {
  webSockets.delete(ws)
}

export const sendMessageToFront = (message: IFrontMessage) => {
  webSockets.forEach(ws => {
    ws.send(JSON.stringify(message))
  })
}


let publicIntervalRecords: NodeJS.Timeout[] = []

export const startMockBoardMessage = (signalMap: Map<string, string[]>) => {
  // signalMap是一个Map，忽略key，以每组的value为键值，模拟数据源
  // 每个value是一个数组，数组的每个元素是一个信号的值
  const valueGroups = Array.from(signalMap.values())

  valueGroups.forEach((values, index) => {
    const record = setInterval(() => {
      const message: { [key: string]: number } = {}
      values.forEach((value) => {
        message[value] = Math.random() * 100
      })

      TestConfigService.currentTestConfigHistoryData.push({
        time: new Date().getTime(),
        data: message
      });

      sendMessageToFront({
        type: "DATA",
        message: JSON.stringify(message)
      })
    }, Math.random() * 1000 + 1000)
    publicIntervalRecords.push(record)
  })
}

export const stopMockBoardMessage = () => {
  publicIntervalRecords.forEach((record) => {
    clearInterval(record)
  })
  publicIntervalRecords = []
}

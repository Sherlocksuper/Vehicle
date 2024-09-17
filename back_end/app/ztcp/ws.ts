// @ts-ignore
import WebSocket from 'ws';
import {removeListener} from "process";

export let webSockets: Set<WebSocket> = new Set()

export const addWebSocket = (ws: WebSocket) => {
  webSockets.add(ws)
}

export const removeWebSocket = (ws: WebSocket) => {
  webSockets.delete(ws)
}

export const sendMessage = (message: string) => {
  webSockets.forEach(ws => {
    ws.send(message)
  })
}


let publicIntervalRecords: NodeJS.Timeout[] = []

export const startMockBoardMessage = (signalMap: Map<string, string[]>) => {
  // signalMap是一个Map，忽略key，以每组的value为键值，模拟数据源
  // 每个value是一个数组，数组的每个元素是一个信号的值
  console.log("start mock board message")
  const valueGroups = Array.from(signalMap.values())

  valueGroups.forEach((values, index) => {
    const record = setInterval(() => {
      const message: { [key: string]: number } = {}
      values.forEach((value) => {
        message[value] = Math.random() * 100
      })
      sendMessage(JSON.stringify(message))
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

// @ts-ignore
import WebSocket from 'app/ztcp/toFront';
import TestConfigService from "../service/TestConfig";
import {ITimeData} from "../../utils/BoardUtil/decoding";
import {getFrontFormatMessage} from "../../utils";
import {mapToJson} from "./toBoard";

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

const generateSineWave = (frequency: number, amplitude: number, phase: number, time: number) => {
  return amplitude * Math.sin(2 * Math.PI * frequency * time + phase);
}

export const startMockBoardMessage = (signalMap: Map<string, string[]>, useBeidou: boolean = true) => {
  // signalMap是一个Map，忽略key，以每组的value为键值，模拟数据源
  // 每个value是一个数组，数组的每个元素是一个信号的值
  const valueGroups = Array.from(signalMap.values())

  valueGroups.forEach((values, index) => {
    const record = setInterval(() => {
      const message: { [key: string]: number } = {}
      values.forEach((value) => {
        const frequency = 1; // 频率，可以根据需要调整
        const amplitude = 100; // 振幅，可以根据需要调整
        const phase = 0; // 相位，可以根据需要调整
        const time = new Date().getTime() / 1000; // 当前时间，单位为秒
        message[value] = generateSineWave(frequency, amplitude, phase, time);
      });

      // 如果用北斗，时间换2004，但是只换时间
      let currentTime: Date | number = new Date()
      currentTime = currentTime.getTime()
      TestConfigService.pushDataToCurrentHistory({
        time: currentTime,
        data: message
      });
      const responseMessage = getFrontFormatMessage(message, currentTime)

      sendMessageToFront({
        type: "DATA",
        message: mapToJson(responseMessage)
      })
    }, 100)
    publicIntervalRecords.push(record)
  })
}

export const stopMockBoardMessage = () => {
  publicIntervalRecords.forEach((record) => {
    clearInterval(record)
  })
  publicIntervalRecords = []
}

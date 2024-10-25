import TestConfigService from "../app/service/TestConfig";
import {ITimeData} from "./BoardUtil/decoding";

export function getFrontFormatMessage(message: { [key: string]: number }, currentTime: number) {
  const responseMessage: Map<string, ITimeData> = new Map()
  Object.keys(message).forEach((key) => {
    responseMessage.set(key, {
      time: currentTime,
      value: message[key]
    })
  })

  return responseMessage
}

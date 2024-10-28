import {ITestConfig} from "../../../app/model/TestConfig";
import {getBaseConfig, IPro} from "./baseConfig";
import {getSpConfig} from "./spConfig";
import {ProtocolType} from "../../../app/model/PreSet/Protocol.model";
import {getBanConfig} from "./banConfig";

export const middleHeader = [0xff, 0x00]

//Flexray01,CAN02,MIC03,1552B04,422为05，232为06，模拟量07，数字量08
export const getCollectItem = (protocol: IPro) => {
  switch (protocol.protocol.protocolType) {
    case ProtocolType.FlexRay:
      return 0x01
    case ProtocolType.CAN:
      return 0x02
    case ProtocolType.MIC:
      return 0x03
    case ProtocolType.B1552B:
      return 0x04
    case ProtocolType.Serial422:
      return 0x05
    case ProtocolType.Serial232:
      return 0x06
    case ProtocolType.Analog:
      return 0x07
    case ProtocolType.Digital:
      return 0x08
  }
}

export const getCollectItemFromId = (id: number) => {
  switch (id) {
    case 1:
      return ProtocolType.FlexRay
    case 2:
      return ProtocolType.CAN
    case 3:
      return ProtocolType.MIC
    case 4:
      return ProtocolType.B1552B
    case 5:
      return ProtocolType.Serial422
    case 6:
      return ProtocolType.Serial232
    case 7:
      return ProtocolType.Analog
    case 8:
      return ProtocolType.Digital
  }
}

// 如果是数模采集，返回0x01，如果是总线采集，返回0x00
export const getCollectType = (protocol: IPro) => {
  if (protocol.protocol.protocolType === ProtocolType.Analog ||
    protocol.protocol.protocolType === ProtocolType.Digital) {
    return 0x01
  }
  return 0x00
}

export const getBusCategory = (protocol: IPro) => {
  switch (protocol.protocol.protocolType) {
    case ProtocolType.FlexRay:
      return 0x01
    case ProtocolType.CAN:
      return 0x02
    case ProtocolType.MIC:
      return 0x03
    case ProtocolType.B1552B:
      return 0x04
    case ProtocolType.Serial422:
      return 0x05
    case ProtocolType.Serial232:
      return 0x06
    case ProtocolType.Analog:
      return 0x07
    case ProtocolType.Digital:
      return 0x08
  }
}

export const transferTo8 = (num: number) => {
  const buffer = Buffer.alloc(1);
  buffer.writeUInt8(num, 0);
  return buffer
}

// 把一个数字转化为16位的buffer
export const transferTo16 = (num: number) => {
  const buffer = Buffer.alloc(2);
  buffer.writeUInt16BE(num, 0);
  return buffer
}

export const transferTo24 = (num: number) => {
  const buffer = Buffer.alloc(3);
  buffer.writeUIntBE(num, 0, 3);
  return buffer
}

export const transferTo32 = (num: number) => {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(num, 0);
  return buffer
}


export const getConfigBoardMessage = (config: ITestConfig) => {
  const result: Buffer[] = []
  const banMessages: Buffer[] = []
  const enableMessage: Buffer[] = []
  const signalsMap = new Map<string, string[]>()

  config.configs.forEach((config) => {
    config.vehicle.protocols.forEach((protocol) => {
      const baseConfig = getBaseConfig(protocol)
      result.push(baseConfig)

      // NOTE:推入信号解析配置
      const spConfigResult = getSpConfig(protocol)
      result.push(...spConfigResult.resultMessages)
      spConfigResult.signalsMap.forEach((value, key) => {
        if (signalsMap.has(key)) {
          signalsMap.get(key)!.push(...value)
        } else {
          signalsMap.set(key, value)
        }
      })

      const enableConfig = getEnableConfig(protocol)
      // result.push(enableConfig)
      enableMessage.push(enableConfig)

      const banConfig = getBanConfig(protocol)
      banMessages.push(banConfig)
    })
  })

  return {resultMessages: result, signalsMap: signalsMap, banMessages: banMessages, enableMessage: enableMessage}
}

// 使能：ff 00 02(目标ID，Flexray、CAN、MIC、1552B、串口为02，模拟量、数字量为03) 02(采集项，Flexray01,CAN02,MIC03,1552B04,串口：422为05，232为06，模拟量07，数字量08)
// 0E(功能码)
export const getEnableConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(middleHeader)
  const targetId = protocol.collector.collectorAddress
  const collectItem = getCollectItem(protocol)!
  const functionCode = 0x0e
  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode])])
  return result
}

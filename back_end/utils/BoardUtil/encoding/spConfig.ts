import {IProtocolSignal, ProtocolType} from "../../../app/model/PreSet/Protocol.model";
import {IPro} from "./baseConfig";
import {getCollectItem} from "./index";


export const totalHeader = [0xff, 0x00]

export const getSignalMapKey = (moduleId: number = 0, frameId: number = 0) => {
  return `${moduleId}/${frameId}`
}

export interface ISpConfigResult {
  resultMessages: Buffer[]
  // 用来表示帧id和信号id的关系，帧id1有abac、sdfadf两个信号
  signalsMap: Map<string, string[]>
}

//用来提示模块进行下发		目标ID	采集项	功能码	……依据配置内容而定，最长80字节
export const getSpConfig = (protocol: IPro): ISpConfigResult => {
  switch (protocol.protocol.protocolType) {
    case ProtocolType.FlexRay:
      return getFlexraySpConfig(protocol)
    case ProtocolType.CAN:
      return getCanSpConfig(protocol)
    case ProtocolType.MIC:
      return getMICSpConfig(protocol)
    case ProtocolType.B1552B:
      return getB1552BSpConfig(protocol)
    case ProtocolType.Serial422:
    case ProtocolType.Serial232:
      return getSerialSpConfig(protocol)
    case ProtocolType.Analog:
      return getAnalogSpConfig(protocol)
    case ProtocolType.Digital:
      return getDigitalSpConfig(protocol)
    default:
      return {resultMessages: [], signalsMap: new Map()}
  }
}

const getOneSignalConfig = (protocol: IProtocolSignal) => {
  return Buffer.from([Number(protocol.startPoint), Number(protocol.length), Number(protocol.slope), Number(protocol.offset)])
}

//用来提示模块进行下发		目标ID	采集项	功能码	……依据配置内容而定，最长80字节
const getFlexraySpConfig = (protocol: IPro) => {
  let middleHeader = Buffer.from(totalHeader)

  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc2
  middleHeader = Buffer.concat([middleHeader, Buffer.from([targetId, collectItem, functionCode])])

  const results: Buffer[] = []
  const signalsMap = new Map<string, string[]>()

  protocol.protocol.signalsParsingConfig.forEach(spConfig => {
    // 复制一个middleHeader给a
    let a: Buffer = Buffer.from(middleHeader)
    // 帧id、周期数、信号个数
    a = Buffer.concat([a, Buffer.from([Number(spConfig.frameNumber), Number(spConfig.frameId), Number(spConfig.cycleNumber), Number(spConfig.signals.length)])])

    const key = getSignalMapKey(targetId, Number(spConfig.frameId))

    spConfig.signals.forEach(signal => {
      a = Buffer.concat([a, getOneSignalConfig(signal)])
      if (signalsMap.has(key)) {
        signalsMap.get(key)!.push(signal.id)
      } else {
        signalsMap.set(key, [signal.id])
      }
    })
    results.push(a)
  })

  return {resultMessages: results, signalsMap}
}

const getCanSpConfig = (protocol: IPro) => {
  let middleHeader = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc2
  middleHeader = Buffer.concat([middleHeader, Buffer.from([targetId, collectItem, functionCode])])

  const results: Buffer[] = []
  const signalsMap = new Map<string, string[]>()

  protocol.protocol.signalsParsingConfig.forEach(spConfig => {
    let a: Buffer = Buffer.from(middleHeader)
    a = Buffer.concat([a, Buffer.from([Number(spConfig.frameNumber), Number(spConfig.frameId), Number(spConfig.signals.length)])])

    const key = getSignalMapKey(targetId, Number(spConfig.frameId))

    spConfig.signals.forEach(signal => {
      if (signalsMap.has(key)) {
        signalsMap.get(key)!.push(signal.id)
      } else {
        signalsMap.set(key, [signal.id])
      }
      a = Buffer.concat([a, getOneSignalConfig(signal)])
    })
    results.push(a)
  })

  return {resultMessages: results, signalsMap}
}

const getMICSpConfig = (protocol: IPro) => {
  let middleHeader = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc2
  middleHeader = Buffer.concat([middleHeader, Buffer.from([targetId, collectItem, functionCode])])

  const results: Buffer[] = []
  const signalsMap = new Map<string, string[]>()

  // 只有一个signalParsingConfig
  let a: Buffer = Buffer.from(middleHeader)
  const spConfig = protocol.protocol.signalsParsingConfig[0]
  a = Buffer.concat([a, Buffer.from([Number(spConfig.frameNumber), Number(spConfig.modadd), Number(spConfig.devId)])])

  const key = getSignalMapKey(targetId, 0)

  spConfig.signals.forEach(signal => {
    if (signalsMap.has(key)) {
      signalsMap.get(key)!.push(signal.id)
    } else {
      signalsMap.set(key, [signal.id])
    }
  })

  results.push(a)

  return {resultMessages: results, signalsMap}
}

const getB1552BSpConfig = (protocol: IPro) => {
  let middleHeader = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc2
  middleHeader = Buffer.concat([middleHeader, Buffer.from([targetId, collectItem, functionCode])])

  const results: Buffer[] = []
  const signalsMap = new Map<string, string[]>()

  // 只有一个signalParsingConfig
  let a: Buffer = Buffer.from(middleHeader)
  const spConfig = protocol.protocol.signalsParsingConfig[0]
  a = Buffer.concat([a, Buffer.from([Number(spConfig.frameNumber), Number(spConfig.rtAddress), Number(spConfig.childAddress)])])

  const key = getSignalMapKey(targetId, 0)

  spConfig.signals.forEach(signal => {
    if (signalsMap.has(key)) {
      signalsMap.get(key)!.push(signal.id)
    } else {
      signalsMap.set(key, [signal.id])
    }
  })

  results.push(a)

  return {resultMessages: results, signalsMap}
}

const getSerialSpConfig = (protocol: IPro) => {
  let middleHeader = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc2
  middleHeader = Buffer.concat([middleHeader, Buffer.from([targetId, collectItem, functionCode])])

  const results: Buffer[] = []
  const signalsMap = new Map<string, string[]>()

  protocol.protocol.signalsParsingConfig.forEach(spConfig => {
    let a: Buffer = Buffer.from(middleHeader)
    a = Buffer.concat([a, Buffer.from([0x00 , Number(spConfig.signals.length)])])

    const key = getSignalMapKey(targetId)

    spConfig.signals.forEach(signal => {
      if (signalsMap.has(key)) {
        signalsMap.get(key)!.push(signal.id)
      } else {
        signalsMap.set(key, [signal.id])
      }
      a = Buffer.concat([a, getOneSignalConfig(signal)])
    })
    results.push(a)
  })

  return {resultMessages: results, signalsMap}
}

// 获取模拟量SpConfig
const getAnalogSpConfig = (protocol: IPro) => {
  // 直接返回空的
  return {
    resultMessages: [],
    signalsMap: new Map()
  }
}

const getDigitalSpConfig = (protocol: IPro) => {
  // 直接返回空的
  return {
    resultMessages: [],
    signalsMap: new Map()
  }
}

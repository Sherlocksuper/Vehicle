import {IProtocolSignal} from "../../../app/model/PreSet/Protocol.model";
import {IPro} from "./baseConfig";


export const totalHeader = [0xff, 0x00]

export const getSignalMapKey = (moduleId: number, frameId: number) => {
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
    case 'FlexRay':
      return getFlexraySpConfig(protocol)
    case 'CAN':
      return getCanSpConfig(protocol)
    default:
      return {resultMessages: [], signalsMap: new Map()}
  }
}

const getSignalConfig = (protocol: IProtocolSignal) => {
  return Buffer.from([Number(protocol.startPoint), Number(protocol.length), Number(protocol.slope), Number(protocol.offset)])
}

//用来提示模块进行下发		目标ID	采集项	功能码	……依据配置内容而定，最长80字节
const getFlexraySpConfig = (protocol: IPro) => {
  let middleHeader = Buffer.from(totalHeader)

  const targetId = protocol.collector.collectorAddress!
  const collectItem = 0x01
  const functionCode = 0xc2
  middleHeader = Buffer.concat([middleHeader, Buffer.from([targetId, collectItem, functionCode])])

  const results: Buffer[] = []
  const signalsMap = new Map<string, string[]>()

  protocol.protocol.signalsParsingConfig.forEach(spConfig => {
    let a: Buffer = Buffer.from([])

    const key = getSignalMapKey(targetId, Number(spConfig.frameId))

    a = Buffer.concat([a, middleHeader, Buffer.from([Number(spConfig.frameNumber), Number(spConfig.frameId), Number(spConfig.cycleNumber), Number(spConfig.signals.length)])])

    spConfig.signals.forEach(signal => {
      a = Buffer.concat([a, getSignalConfig(signal)])
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
  const collectItem = 0x02
  const functionCode = 0xc2
  middleHeader = Buffer.concat([middleHeader, Buffer.from([targetId, collectItem, functionCode])])

  const results: Buffer[] = []
  const signalsMap = new Map<string, string[]>()

  protocol.protocol.signalsParsingConfig.forEach(spConfig => {
    let a: Buffer = Buffer.from([])

    const key = getSignalMapKey(targetId, Number(spConfig.frameId))

    a = Buffer.concat([a, middleHeader])
    a = Buffer.concat([a, Buffer.from([Number(spConfig.frameNumber), Number(spConfig.frameId), Number(spConfig.signals.length)])])
    spConfig.signals.forEach(signal => {
      if (signalsMap.has(key)) {
        signalsMap.get(key)!.push(signal.id)
      } else {
        signalsMap.set(key, [signal.id])
      }
      a = Buffer.concat([a, getSignalConfig(signal)])
    })
    results.push(a)
  })

  return {resultMessages: results, signalsMap}
}

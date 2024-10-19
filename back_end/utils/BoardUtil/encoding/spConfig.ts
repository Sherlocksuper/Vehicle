import {IProtocolSignal, ProtocolType} from "../../../app/model/PreSet/Protocol.model";
import {IPro} from "./baseConfig";
import {getBusCategory, getCollectItem, getCollectType, transferTo16, transferTo32, transferTo8} from "./index";
import {off} from "process";
import {start} from "repl";


export const totalHeader = [0xff, 0x00]

// 模块Id、采集类型、总线种类、frameId
export const getSignalMapKey = (moduleId: number,
                                collectType: number,
                                busType: number,
                                frameId: number) => {
  if (!frameId) frameId = 0

  return `${moduleId}-${collectType}-${busType}-${frameId}`
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

/**
 * @param protocol
 * 起点、长度、斜率、偏移
 */
const getOneSignalConfig = (protocol: IProtocolSignal) => {
  const startPoint = Number(protocol.startPoint)
  const startPointResult = transferTo8(startPoint)
  const length = Number(protocol.length)

  // 斜率
  let slope = Number(protocol.slope)
  const isDivided = slope > 1 ? 0 : 1  // 0乘1除
  slope = slope > 1 ? Math.floor(slope) : Math.floor(1 / slope)
  const slopeResult = transferTo8(slope)

  let offset = Number(protocol.offset)
  const isNegative = offset > 0 ? 0 : 1 // 0正1负
  offset = offset > 0 ? offset : -offset
  const offsetResult = transferTo8(offset)

  const lengthResult = transferTo8(length << 2 | isDivided << 1 | isNegative)

  return Buffer.concat([startPointResult, lengthResult, slopeResult, offsetResult])
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
    let a: Buffer = Buffer.from(middleHeader)
    const tNull = 0x00
    const frameNumber = transferTo8(Number(spConfig.frameNumber))
    const frameId = transferTo16(Number(spConfig.frameId))
    a = Buffer.concat([a, frameNumber, frameId, Buffer.from([tNull, Number(spConfig.cycleNumber), Number(spConfig.signals.length)])])

    const collectType = getCollectType(protocol)
    const collectCategory = getBusCategory(protocol)
    const key = getSignalMapKey(targetId, collectType, collectCategory, Number(spConfig.frameId))

    // 加入每个信号的配置, 通过key（帧id）来把不同signal分组,
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

    const frameNumber = transferTo8(Number(spConfig.frameNumber))
    const frameId = transferTo32(Number(spConfig.frameId))
    const signalLength = transferTo8(spConfig.signals.length!)

    a = Buffer.concat([a, frameNumber, frameId, signalLength])

    const collectType = getCollectType(protocol)
    const collectCategory = getBusCategory(protocol)
    const key = getSignalMapKey(targetId, collectType, collectCategory, Number(spConfig.frameId))

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
  protocol.protocol.signalsParsingConfig.forEach(spConfig => {
    let a: Buffer = Buffer.from(middleHeader)

    const frameNumber = transferTo8(Number(spConfig.frameNumber))
    const modadd = transferTo8(spConfig.modadd!)
    // const devSelect = transferTo32(spConfig.devId!)
    const devSelect = transferDevAndChildAdd(spConfig.devId!)

    a = Buffer.concat([a, frameNumber, modadd, devSelect, Buffer.from([Number(spConfig.signals.length)])])

    const collectType = getCollectType(protocol)
    const collectCategory = getBusCategory(protocol)
    const key = getSignalMapKey(targetId, collectType, collectCategory, 0)

    spConfig.signals.forEach(signal => {
      if (signalsMap.has(key)) {
        signalsMap.get(key)!.push(signal.id)
      } else {
        signalsMap.set(key, [signal.id])
      }
      // MIC没有信号配置，所以不需要加到后面
      a = Buffer.concat([a, getOneSignalConfig(signal)])
    })

    results.push(a)
  })


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

  protocol.protocol.signalsParsingConfig.forEach(spConfig => {
    let a: Buffer = Buffer.from(middleHeader)

    const frameNumber = transferTo8(Number(spConfig.frameNumber))
    const rtAddress = transferTo8(spConfig.rtAddress!)
    // const devSelect = transferTo32(spConfig.devId!)
    const childAddress = transferDevAndChildAdd(spConfig.childAddress!)

    a = Buffer.concat([a, frameNumber, rtAddress, childAddress, Buffer.from([Number(spConfig.signals.length)])])

    const collectType = getCollectType(protocol)
    const collectCategory = getBusCategory(protocol)
    const key = getSignalMapKey(targetId, collectType, collectCategory, 0)

    spConfig.signals.forEach(signal => {
      if (signalsMap.has(key)) {
        signalsMap.get(key)!.push(signal.id)
      } else {
        signalsMap.set(key, [signal.id])
      }
      // 1552B有信号配置，所以需要加到后面
      a = Buffer.concat([a, getOneSignalConfig(signal)])
    })
    results.push(a)
  })

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

    const frameNumber = 0x00
    a = Buffer.concat([a, Buffer.from([frameNumber, Number(spConfig.signals.length)])])

    const collectType = getCollectType(protocol)
    const collectCategory = getBusCategory(protocol)
    const key = getSignalMapKey(targetId, collectType, collectCategory, 0)

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
  let middleHeader = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)

  const functionCode = 0xc2
  middleHeader = Buffer.concat([middleHeader, Buffer.from([targetId, collectItem, functionCode])])

  const results: Buffer[] = []
  const signalsMap = new Map<string, string[]>()

  protocol.protocol.signalsParsingConfig.forEach(spConfig => {
    let a: Buffer = Buffer.from(middleHeader)

    const frameNumber = 0x00
    a = Buffer.concat([a, Buffer.from([frameNumber, Number(spConfig.signals.length)])])

    const collectType = getCollectType(protocol)
    const collectCategory = getBusCategory(protocol)
    const key = getSignalMapKey(targetId, collectType, collectCategory, 0)

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

const getDigitalSpConfig = (protocol: IPro) => {
  const targetId = protocol.collector.collectorAddress!
  const collectType = getCollectType(protocol)
  const collectCategory = getBusCategory(protocol)

  const signalsMap = new Map<string, string[]>()

  protocol.protocol.signalsParsingConfig.forEach(spConfig => {
    const key = getSignalMapKey(targetId, collectType, collectCategory, 0)
    spConfig.signals.forEach(signal => {
      if (signalsMap.has(key)) {
        signalsMap.get(key)!.push(signal.id)
      } else {
        signalsMap.set(key, [signal.id])
      }
    })
  })


  return {
    resultMessages: [],
    signalsMap: signalsMap
  }
}
export const transferDevAndChildAdd = (values: number[]) => {
  console.log(values)
  if (!values) values = []
  if (!Array.isArray(values)) values = Array.from(values)
  const calculateResult = (start: number, end: number) => {
    let result = 0;
    for (let i = start; i <= end; i++) {
      if (!(values?.includes(i))) continue;
      const offset = end - i;
      result |= (1 << offset);
    }
    return result;
  };

  const result1 = calculateResult(0, 7);
  const result2 = calculateResult(8, 15);
  const result3 = calculateResult(16, 23);
  const result4 = calculateResult(24, 31);
  console.log("transfer result", result1, result2, result3, result4)

  return Buffer.concat([transferTo8(result1), transferTo8(result2), transferTo8(result3), transferTo8(result4)]);
};

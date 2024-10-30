import {IProtocolSignal} from "../../app/model/PreSet/Protocol.model";
import {IData} from "../../app/model/Data.model";
import {encode} from "punycode";
import {ITestConfig} from "../../app/model/TestConfig";


export const formatHeader = (config: ITestConfig) => {
  const bodySize = 0
  return wrapHeader(config, bodySize)
}

const wrapHeader = (testConfig: ITestConfig, bodySize: number) => {
  const encoder = new TextEncoder()
  const totalSignals: string[] = getTotalSignals(testConfig)
  const usedSignals: IProtocolSignal[] = getUsedSignals(testConfig)

  const version = testConfig.dataWrap.version?.trim() === "" ? "version" : testConfig.dataWrap.version ?? "未定义";
  const equipmentType = testConfig.dataWrap.equipmentType?.trim() === "" ? "equipmentType" : testConfig.dataWrap.equipmentType ?? "未定义";
  const equipmentId = testConfig.dataWrap.equipmentId?.trim() === "" ? "equipmentId" : testConfig.dataWrap.equipmentId ?? "未定义";
  let dataLength = 0 // 初始化dataLength

  let dataStat = ''

  // 构造dataStat字符串
  for (let i = 0; i < totalSignals.length; i++) {
    const currentSignal = totalSignals[i]
    if (usedSignals.findIndex(item => item.id === currentSignal) !== -1) {
      dataStat += "1"
    } else {
      dataStat += "0"
    }
  }

  let finalResult = ""

  // 迭代直到dataLength稳定
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // 构造包含当前dataLength的部分结果
    const partialResult = [version, equipmentType, equipmentId, dataLength + bodySize, dataStat].join(" ")
    const newDataLength = encoder.encode(partialResult).length

    // 如果新计算的dataLength与之前相同，退出循环
    if (newDataLength === dataLength) {
      finalResult = partialResult
      break
    }

    // 否则更新dataLength并继续循环
    dataLength = newDataLength
  }

  return finalResult
}


export const formatOneSignal = (signal: IData) => {
  return wrapOneSignal(signal.time, signal.name, signal.dimension, signal.value)
}

const wrapOneSignal = (time: number, name: string, dimension: string, value: number) => {
  const date = new Date(time)
  const dateResultP1 = [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-")
  const dateResultP2 = [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()].join("-")
  const dateResult = dateResultP1 + "." + dateResultP2
  let numResult = name + ":" + value
  if (dimension !== "/") {
    numResult += dimension
  }

  let numLength = 0
  let finalResult = ""

  // 迭代直到numLength稳定
  // eslint-disable-next-line no-constant-condition
  let times = 0
  while (times < 100) {
    // 构造包含当前numLength的字符串
    times ++
    const partialResult = [dateResult, numLength, numResult].join(" ")
    const newNumLength = encode(partialResult).length

    // 如果新计算的长度与之前的相同，则退出循环
    if (newNumLength === numLength) {
      finalResult = partialResult
      break
    }

    // 否则更新numLength并继续循环
    numLength = newNumLength
  }

  return finalResult
}


const getTotalSignals = (config: ITestConfig) => {
  const result: string[] = []
  if (!config) return result
  config.configs.forEach(config => {
    config.vehicle.protocols.forEach(protocol => {
      protocol.protocol.signalsParsingConfig.forEach(spConfig => {
        spConfig.signals.forEach(signal => {
          result.push(signal.id)
        })
      })
    })
  })
  return result
}

const getUsedSignals = (config: ITestConfig) => {
  const result: IProtocolSignal[] = []
  if (!config) return result
  config.configs.forEach(config => {
    config.projects.forEach(project => {
      project.indicators.forEach(indicator => {
        result.push(indicator.signal)
      })
    })
  })

  return result
}


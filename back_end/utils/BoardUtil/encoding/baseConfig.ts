import {IAIOBaseConfig, IB1552BBaseConfig, ICanBaseConfig, IFlexRayBaseConfig, IMICBaseConfig, IProtocolModel, ISerialBaseConfig, ProtocolType} from "../../../app/model/PreSet/Protocol.model";
import {IControllerModel} from "../../../app/model/BoardManage/Controller.model";
import {ICollectorModel} from "../../../app/model/BoardManage/Collector.model";
import {getCollectItem, transferTo16, transferTo24, transferTo32, transferTo8} from "./index";
import {createSecureServer} from "http2";

export const totalHeader = [0xff, 0x00]

export interface IPro {
  protocol: IProtocolModel,
  core: IControllerModel,
  collector: ICollectorModel,
}

export const getBaseConfig = (protocol: IPro) => {
  switch (protocol.protocol.protocolType) {
    case ProtocolType.FlexRay:
      return getFlexrayBaseConfig(protocol)
    case ProtocolType.CAN:
      return getCanBaseConfig(protocol)
    case ProtocolType.MIC:
      return getMICBaseConfig(protocol)
    case ProtocolType.B1552B:
      return get1552BBaseConfig(protocol)
    case ProtocolType.Serial422:
      return getSerial422BaseConfig(protocol)
    case ProtocolType.Serial232:
      return getSerial232BaseConfig(protocol)
    case ProtocolType.Analog:
      return getAnalogBaseConfig(protocol)
    case ProtocolType.Digital:
      return getDigitalBaseConfig(protocol)
    default:
      return Buffer.from([])
  }
}

const getFlexrayBaseConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const reversed = 0x00
  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, reversed])])
  const flexConfig = (protocol.protocol.baseConfig as IFlexRayBaseConfig)
  const buffer = Buffer.alloc(12);
  const microticksPerCycle = transferTo16(flexConfig.microticksPerCycle)
  const macroticksPerCycle = transferTo16(flexConfig.macroticksPerCycle)
  const transmissionStartTime = transferTo8(flexConfig.transmissionStartTime)
  const staticFramepayload = transferTo8(flexConfig.staticFramepayload)
  const staticSlotLength = transferTo16(flexConfig.staticSlotLength)
  const staticSlotsCount = transferTo16(flexConfig.staticSlotsCount)
  const dynamicSlotCount = transferTo16(flexConfig.dynamicSlotCount)
  const dynamicSlotLength = transferTo8(flexConfig.dynamicSlotLength)
  const setAsSyncNode = transferTo8(flexConfig.setAsSyncNode)

  result = Buffer.concat([result, microticksPerCycle, macroticksPerCycle, transmissionStartTime, staticFramepayload, staticSlotLength, staticSlotsCount, dynamicSlotCount, dynamicSlotLength, setAsSyncNode])
  return result
}

const getCanBaseConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const reversed = 0x00
  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, reversed])])

  const canConfig = (protocol.protocol.baseConfig as ICanBaseConfig)
  const baudRateBuffer = transferTo16(canConfig.baudRate)
  // const baudRateBuffer = transferTo24(canConfig.baudRate)

  // Concatenate the buffers
  result = Buffer.concat([result, baudRateBuffer])
  return result
}

const getMICBaseConfig = (protocol: IPro) => {
  //					reserved	NCTC	BTC	NRTC	MODADD	数据更新速率
  // 0xff	0x00	0x02	0x03	0xC1	0x00	8位	8位	8位	8位	8位
  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const reversed = 0x00

  const baseConfig = protocol.protocol.baseConfig as IMICBaseConfig

  //NCTC	BTC	NRTC	MODADD
  const nctc = transferTo8(baseConfig.nctc)
  const btc = transferTo8(baseConfig.btc)
  const nrtc = transferTo8(baseConfig.nrtc)
  const modadd = transferTo8(baseConfig.modadd)
  const dataUpdateRate = transferTo8(baseConfig.dataUpdateRate)


  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, reversed])])
  result = Buffer.concat([result, nctc, btc, nrtc, modadd, dataUpdateRate])
  return result
}

const get1552BBaseConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const tNull = transferTo8(0)
  const reversed = transferTo24(0)
  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode]), tNull, reversed])

  const b1552BConfig = (protocol.protocol.baseConfig as IB1552BBaseConfig)
  // const listenAddress = transferTo32(b1552BConfig.listenAddress)
  const modadd = transferTo8(b1552BConfig.modadd)
  const dataUpdateRate = transferTo8(b1552BConfig.dataUpdateRate)
  result = Buffer.concat([result, modadd, dataUpdateRate])
  return result
}

const getSerial422BaseConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const tNull = 0x00

  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, tNull])])

  const serial422Config = (protocol.protocol.baseConfig as ISerialBaseConfig)
  const baudRate = transferTo32(serial422Config.baudRate)
  const stopBits = transferTo8(serial422Config.stopBits)
  const check = transferTo8(serial422Config.check)
  const checkType = transferTo8(serial422Config.checkType)
  result = Buffer.concat([result, baudRate, stopBits, check, checkType])

  return result
}

const getSerial232BaseConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const tNull = 0x00

  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, tNull])])

  const serial232Config = (protocol.protocol.baseConfig as ISerialBaseConfig)
  const baudRate = transferTo32(serial232Config.baudRate)
  const stopBits = transferTo8(serial232Config.stopBits)
  const check = transferTo8(serial232Config.check)
  const checkType = transferTo8(serial232Config.checkType)
  result = Buffer.concat([result, baudRate, stopBits, check, checkType])

  return result
}

const getAnalogBaseConfig = (protocol: IPro) => {

  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const tNull = 0x00

  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, tNull])])

  const analogConfig = (protocol.protocol.baseConfig as IAIOBaseConfig)
  result = Buffer.concat([result, Buffer.from([analogConfig.dataUpdateRate])])

  return result
}

const getDigitalBaseConfig = (protocol: IPro) => {

  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const reversed = 0x00

  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, reversed])])

  const analogConfig = (protocol.protocol.baseConfig as IAIOBaseConfig)
  result = Buffer.concat([result, Buffer.from([analogConfig.dataUpdateRate])])

  return result
}

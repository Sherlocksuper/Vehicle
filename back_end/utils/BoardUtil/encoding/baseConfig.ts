import {IAIOBaseConfig, IB1552BBaseConfig, ICanBaseConfig, IFlexRayBaseConfig, IMICBaseConfig, IProtocolModel, ISerialBaseConfig, ProtocolType} from "../../../app/model/PreSet/Protocol.model";
import {IControllerModel} from "../../../app/model/BoardManage/Controller.model";
import {ICollectorModel} from "../../../app/model/BoardManage/Collector.model";
import {getCollectItem} from "./index";

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
  buffer.writeUInt16BE(flexConfig.microticksPerCycle, 0);
  buffer.writeUInt16BE(flexConfig.macroticksPerCycle, 2);
  buffer.writeUInt8(flexConfig.transmissionStartTime, 4);
  buffer.writeUInt8(flexConfig.staticFramepayload, 5);
  buffer.writeUInt16BE(flexConfig.staticSlotsCount, 6);
  buffer.writeUInt16BE(flexConfig.dynamicSlotCount, 8);
  buffer.writeUInt8(flexConfig.dynamicSlotLength, 10);
  buffer.writeUInt8(flexConfig.setAsSyncNode, 11);
  result = Buffer.concat([result, buffer])

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
  result = Buffer.concat([result, Buffer.from([canConfig.baudRate])])
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

  //NCTC	BTC	NRTC	MODADD
  const nctc = (protocol.protocol.baseConfig as IMICBaseConfig).nctc
  const btc = (protocol.protocol.baseConfig as IMICBaseConfig).btc
  const nrtc = (protocol.protocol.baseConfig as IMICBaseConfig).nrtc
  const modadd = (protocol.protocol.baseConfig as IMICBaseConfig).modadd
  const dataUpdateRate = (protocol.protocol.baseConfig as IMICBaseConfig).dataUpdateRate


  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, reversed])])
  result = Buffer.concat([result, Buffer.from([nctc, btc, nrtc, modadd, dataUpdateRate])])
  console.log("mic config from", protocol.protocol.protocolName, ":", result)
  return result
}

const get1552BBaseConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const reversed = 0x00
  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, reversed])])

  const b1552BConfig = (protocol.protocol.baseConfig as IB1552BBaseConfig)
  const listenAddress = b1552BConfig.listenAddress
  result = Buffer.concat([result, Buffer.from([listenAddress])])

  return result
}

const getSerial422BaseConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const reversed = 0x00

  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, reversed])])

  const serial422Config = (protocol.protocol.baseConfig as ISerialBaseConfig)
  const baudRate = serial422Config.baudRate
  const stopBits = serial422Config.stopBits
  const check = serial422Config.check
  const checkType = serial422Config.checkType
  result = Buffer.concat([result, Buffer.from([baudRate, stopBits, check, checkType])])

  return result
}

const getSerial232BaseConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress!
  const collectItem = getCollectItem(protocol)
  const functionCode = 0xc1
  const reversed = 0x00

  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, reversed])])

  const serial422Config = (protocol.protocol.baseConfig as ISerialBaseConfig)
  const baudRate = serial422Config.baudRate
  const stopBits = serial422Config.stopBits
  const check = serial422Config.check
  const checkType = serial422Config.checkType
  result = Buffer.concat([result, Buffer.from([baudRate, stopBits, check, checkType])])

  return result
}

const getAnalogBaseConfig = (protocol: IPro) => {

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

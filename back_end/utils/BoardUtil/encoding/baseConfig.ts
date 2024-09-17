import {ICanBaseConfig, IFlexRayBaseConfig, IProtocolModel} from "../../../app/model/PreSet/Protocol.model";
import {IControllerModel} from "../../../app/model/BoardManage/Controller.model";
import {ICollectorModel} from "../../../app/model/BoardManage/Collector.model";

export const totalHeader = [0xff, 0x00]

export interface IPro {
  protocol: IProtocolModel,
  core: IControllerModel,
  collector: ICollectorModel,
}

export const getBaseConfig = (protocol: IPro) => {
  switch (protocol.protocol.protocolType) {
    case 'FlexRay':
      return getFlexrayBaseConfig(protocol)
    case 'CAN':
      return getCanBaseConfig(protocol)
    default:
      return Buffer.from([])
  }
}

const getFlexrayBaseConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(totalHeader)
  const targetId = protocol.collector.collectorAddress
  const collectItem = 0x01
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
  const collectItem = 0x02
  const functionCode = 0xc1
  const reversed = 0x00
  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode, reversed])])
  const canConfig = (protocol.protocol.baseConfig as ICanBaseConfig)
  result = Buffer.concat([result, Buffer.from([canConfig.baudRate])])
  return result
}

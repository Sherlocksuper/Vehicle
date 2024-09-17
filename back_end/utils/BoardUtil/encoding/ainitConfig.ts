import {IPro} from "./baseConfig";
import {ProtocolType} from "../../../app/model/PreSet/Protocol.model";

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
    case ProtocolType.A422:
      return 0x05
    case ProtocolType.A232:
      return 0x06
    case ProtocolType.Analog:
      return 0x07
    case ProtocolType.Digital:
      return 0x08
  }
}

//初始化：ff 00 02(目标ID，Flexray、CAN、MIC、1552B、串口为02，模拟量、数字量为03) 02(采集项，Flexray01,CAN02,MIC03,1552B04,串口：422为05，232为06，模拟量07，数字量08) 0D(功能码)
export const getInitConfig = (protocol: IPro) => {
  let result: Buffer = Buffer.from(middleHeader)
  const targetId = protocol.collector.collectorAddress
  const collectItem = getCollectItem(protocol)!
  const functionCode = 0x0d
  result = Buffer.concat([result, Buffer.from([targetId, collectItem, functionCode])])
  return result
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

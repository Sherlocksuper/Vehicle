import {getCollectItem} from "./index";
import {IPro} from "./baseConfig";

export const getBanConfig = (protocol: IPro) => {
  //0xff	0x00 targetId  collectItem			0x0E		配置后，对模块进行使能
  const collectItem = getCollectItem(protocol)
  const targetId = protocol.collector.collectorAddress!

  const functionCode = 0x0d

  let result = Buffer.from([0xff,0x00 ,targetId, collectItem, functionCode])
  return result
}

import {ITestConfig} from "../../../app/model/TestConfig";
import {getBaseConfig} from "./baseConfig";
import {getEnableConfig, getInitConfig} from "./ainitConfig";
import {getSpConfig} from "./spConfig";


export const getConfigBoardMessage = (config: ITestConfig) => {
  const result: Buffer[] = []
  const signalsMap = new Map<string, string[]>()

  config.configs.forEach((config) => {
    config.vehicle.protocols.forEach((protocol) => {
      result.push(getBaseConfig(protocol))

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
      result.push(enableConfig)
    })
  })

  return {resultMessages: result, signalsMap}
}

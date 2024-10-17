import {IHistory} from "@/apis/standard/history.ts";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";

self.onmessage = async (event: MessageEvent<unknown>) => {

  const params = event.data as {
    history: IHistory,
    searchName: string,
    startTime: number,
    endTime: number
  }
  // const history = JSON.parse(text) as IHistory

  const response: IProtocolSignal[] = getTargetSignal(params.history, params.searchName, params.startTime, params.endTime)

  self.postMessage(response)
}

// 解析history，
const getTargetSignal = (history: IHistory, searchName: string, startTime: number, endTime: number): IProtocolSignal[] => {
  const result: IProtocolSignal[] = []

  const isSearchRight = (time: number) => (time > startTime && time < endTime)
  const keyValuesMap = new Map<string, {
    time: number,
    value: number
  }[]>()

  history.historyData.forEach(hisData => {
    if (isSearchRight(hisData.time)) {
      const keys = Object.keys(hisData.data)
      keys.forEach((key) => {
        const newValue = {
          time: hisData.time,
          value: hisData.data[key]
        }
        if (keyValuesMap.has(key)) {
          const currentValue = keyValuesMap.get(key)
          currentValue.push(newValue)
          keyValuesMap.set(key, currentValue)
        } else {
          keyValuesMap.set(key, [newValue])
        }
      })
    }
  })

  console.log(keyValuesMap)

  history.testConfig.configs.forEach(config => {
    config.projects.forEach(project => {
      project.indicators.forEach(indicator => {
        if (indicator.signal.name.includes(searchName)) {
          const signal = {...indicator.signal}
          signal.totalDataArr = keyValuesMap.get(signal.id)
          result.push(signal)
        }
      })
    })
  })

  return result
}


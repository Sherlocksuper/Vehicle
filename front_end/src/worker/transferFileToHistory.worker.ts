import {IHistory} from "@/apis/standard/history.ts";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";

self.onmessage = async (event: MessageEvent<File>) => {

  const result = event.data;
  const text = await result.text()
  const history = JSON.parse(text) as IHistory
  history.dataParseResult = parsingDataForProtocolSignal(history)

  self.postMessage(history)
}

// 解析history，
const parsingDataForProtocolSignal = (history: IHistory): IProtocolSignal[] => {
  const signals: IProtocolSignal[] = []
  const result = calculateStats(history.historyData)

  history.testConfig.configs.forEach(config => {
    config.projects.forEach(project => {
      project.indicators.forEach(indicator => {
        const signal = {...indicator.signal}
        signal.dataArr = []
        signal.dataArr.push(result[signal.id].max)
        signal.dataArr.push(result[signal.id].min)
        signal.dataArr.push(result[signal.id].avg)
        signals.push(signal)
      })
    })
  })

  return signals
}

const calculateStats = (historyData: {
  time: number
  data: {
    [key: number]: number
  }
}[]): {
  [key: string]: {
    max: number
    min: number
    sum: number
    count: number
    avg: number
  }
} => {
  const idStats = {};

  // 遍历每个historyData元素
  historyData.forEach(entry => {
    const data = entry.data;
    for (const id in data) {
      const value = data[id];
      if (!idStats[id]) {
        idStats[id] = {max: value, min: value, sum: value, count: 1};
      } else {
        idStats[id].max = Math.max(idStats[id].max, value);
        idStats[id].min = Math.min(idStats[id].min, value);
        idStats[id].sum += value;
        idStats[id].count += 1;
      }
    }
  });

  // 计算每个id的平均值
  for (const id in idStats) {
    idStats[id].avg = idStats[id].sum / idStats[id].count;
  }

  return idStats;
}


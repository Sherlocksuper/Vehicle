import {IHistory} from "@/apis/standard/history.ts";

self.onmessage = async (event: MessageEvent<File>) => {

    const result = event.data;
    const text = await result.text()
    let history = JSON.parse(text) as IHistory
    history = parsingDataForProtocolSignal(history)

    self.postMessage(history)
}

// 解析history，
const parsingDataForProtocolSignal = (history: IHistory): IHistory => {
  return history
}

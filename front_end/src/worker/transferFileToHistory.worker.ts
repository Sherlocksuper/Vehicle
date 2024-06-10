import {IHistory} from "@/apis/standard/history.ts";

self.onmessage = async (event: MessageEvent<File>) => {

    const result = event.data;
    const text = await result.text()
    const history = JSON.parse(text) as IHistory

    self.postMessage(history)
}
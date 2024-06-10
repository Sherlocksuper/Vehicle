import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {IHistory, IHistoryItemData, ITemplateData} from "@/apis/standard/history.ts";

/**
 * transfer the history to a file
 */

self.onmessage = (event: MessageEvent<IHistory>) => {
    const result = event.data as IHistory;
    result.endTime = Date.now()
    const file = new File([JSON.stringify(result)], 'result.json', {type: 'application/json'})
    self.postMessage(file)
}
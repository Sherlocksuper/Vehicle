import {ITestProcessN} from "@/apis/standard/testProcessN.ts";
import {IHistory, IHistoryItemData, ITemplateData} from "@/apis/standard/history.ts";

self.onmessage = (event) => {

    const result = event.data as IHistory;
    const blob = new Blob([JSON.stringify(result)], {type: 'application/json'});

    self.postMessage(blob)
}
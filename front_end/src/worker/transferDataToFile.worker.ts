/**
 * transfer the history to a file
 */
import {IHistory} from "@/apis/standard/history.ts";
import {wrapData} from "@/utils";

self.onmessage = (event) => {
  const result = event.data as IHistory;
  const data = wrapData(result)
  const file = new File([data], 'result.txt', {type: 'text/plain'})
  self.postMessage(file)
}

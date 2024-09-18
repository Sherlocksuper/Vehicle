import {IHistory} from "@/apis/standard/history.ts";

export interface IFileExportProps {
    startTime: number
    endTime: number
    fileName: string
    file: File
}

/**
 * 接收参数，删除早于startTime和晚于endTime的数据
 * @param e
 */
self.onmessage = async (e: MessageEvent<IFileExportProps>) => {
    const {startTime, endTime, fileName, file} = e.data

    const text = await file.text()
    const history = JSON.parse(text) as IHistory

    history.startTime = startTime
    history.endTime = endTime

    history.historyData = history.historyData.map((item) => {
        const itemTime = item["time"]
        if (itemTime > startTime && itemTime < endTime) {
            return item
        }
    }).filter((item) => item !== undefined)

    const resultFile = new File([JSON.stringify(history)], fileName, {type: 'application/json'})
    self.postMessage(resultFile)
}

import {ISignalItem} from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
import {IHistoryItemData} from "@/apis/standard/history.ts";

/**
 * @param requestSignals
 */
export const generateRandomData = (requestSignals: ISignalItem[]): IHistoryItemData => {
    const time = new Date().toString()

    //循环根据id生成数据
    const timeData: { [key: number]: number } = {}

    requestSignals.forEach((item) => {
        timeData[item.signal.id] = Math.floor(Math.random() * 100)
    })

    return ({
        xAxis: time,
        data: timeData
    })
}

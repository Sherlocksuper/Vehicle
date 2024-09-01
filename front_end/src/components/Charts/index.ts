import {ISignalItem} from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
import {IHistoryItemData} from "@/apis/standard/history.ts";

/**
 * @param requestSignals
 */
export const generateRandomData = (requestSignals: ISignalItem[]): IHistoryItemData => {
    const time = new Date().getTime()

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


// 用来展示history,并非模拟
// @ts-ignore
export const mockHistoryData = (index: number, pushData: (data: IHistoryItemData) => void, historyData: IHistoryItemData[]) => {
    function mock(index: number) {
        if (!historyData) return

        if (index < historyData.length) {
            pushData(historyData[index])
            // 这里可以添加实际推送数据的逻辑

            const startTime = new Date(historyData[index].xAxis).getTime();
            const endTime = new Date(historyData[index + 1].xAxis).getTime();

            setTimeout(() => {
                mock(index + 1)
            }, endTime - startTime);
        }
    }

    return mock
}

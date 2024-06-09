import {ISignalItem} from "@/views/demo/TestProcessN/TestTemplate/NewTestTemplate.tsx";
import {IRandomData} from "@/components/Charts/interface.ts";

export const generateRandomData = (requestSignals: ISignalItem[]): IRandomData => {
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

import {ISignalItem} from "@/views/demo/TestProcessN/TestTemplate/NewTestTemplate.tsx";
import {IHistoryItemData} from "@/apis/standard/history.ts";

export enum DataSourceType {
    NETWORK = 'network',
    FILE = 'file',
    RANDOM = 'random'
}

export interface IChartInterface {
    startRequest: boolean
    sourceType?: DataSourceType
    requestSignals: ISignalItem[]
    onReceiveData: (data: IHistoryItemData) => void

    requestSignalId: number | null
    width: number
    height: number
    title: string
    trueLabel?: string
    falseLabel?: string
    unit?: string
    during?: number
    min?: number
    max?: number
    label?: string
}

export interface IRandomData {
    xAxis: string
    data: {
        [key: number]: number
    }
}
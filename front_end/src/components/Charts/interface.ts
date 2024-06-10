import {ISignalItem} from "@/views/demo/TestProcessN/TestTemplate/ConfigTestTemplate.tsx";
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
    historyData?: IHistoryItemData[]

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
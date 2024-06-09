import {ISignalItem} from "@/views/demo/TestProcessN/TestTemplate/NewTestTemplate.tsx";

export enum DataSourceType {
    NETWORK = 'network',
    FILE = 'file',
    RANDOM = 'random'
}

export interface IChartInterface {
    startRequest: boolean
    sourceType?: DataSourceType
    requestSignals: ISignalItem[]

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
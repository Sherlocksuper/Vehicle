import {IHistoryItemData} from "@/apis/standard/history.ts";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";

export enum DataSourceType {
    NETWORK = 'network',
    FILE = 'file',
    RANDOM = 'random'
}

export interface IChartInterface {
    startRequest: boolean
    sourceType?: DataSourceType
    requestSignals: IProtocolSignal[]

    historyData?: IHistoryItemData[]
    currentTestChartData?: IHistoryItemData[]

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

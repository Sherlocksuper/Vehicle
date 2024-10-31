import {DragItemType} from "@/views/demo/DataDisplay/display.tsx";
import {IProtocolSignal} from "@/views/demo/ProtocolTable/protocolComponent.tsx";

export interface ITemplate {
    id?: number
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
    itemsConfig: ITemplateItem[]
}


/**
 * 代表每一个控件
 * 其中requestSignals代表所需要请求的所有信息
 * 对于只能够展示一个信号的控件
 * requestSignals只有一个元素
 */
export interface ITemplateItem {
    id?: string
    type: DragItemType
    requestSignalId: number | null
    requestSignals: IProtocolSignal[]
    colors?: string[]
    x: number
    y: number
    width: number
    height: number
    title: string
    interval: number
    trueLabel?: string
    falseLabel?: string
    unit?: string
    during?: number
    min?: number
    max?: number
    label?: string
    windowSize?: number
}

import {DragItemType} from "@/views/demo/TestProcessN/TestTemplate/NewTestTemplate.tsx";

export interface ITemplate {
    id?: number
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
    itemsConfig: ITemplateItem[]
}


export interface ITemplateItem {
    id: string
    type: DragItemType
    requestSignalId: number | null
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
}
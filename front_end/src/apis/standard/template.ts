export enum TestTemplateType {
    BOOLEAN = 'BOOLEAN',
    LINE = 'LINE',
    NUMBER = 'NUMBER'
}

export interface ITemplate {
    id?: number
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
    itemConfig: {
        type: TestTemplateType
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
    }[]
}
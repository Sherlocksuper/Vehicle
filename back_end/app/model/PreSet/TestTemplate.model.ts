/**
 * 用来存放测试模板的模型
 */
import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table, UpdatedAt, CreatedAt} from "sequelize-typescript";
import {IProtocolSignal} from "./Protocol.model";

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
        requestSignals: IProtocolSignal[]
        colors?: string[]
        x: number
        y: number
        width: number
        height: number
        title: string
        interval: number
        trueValue?: string
        trueLabel?: string
        falseLabel?: string
        unit?: string
        during?: number
        min?: number
        max?: number
        label?: string
        windowSize?: number
    }[]
}

@Table({
    tableName: 'test_templates',
    timestamps: false
})

export default class TestTemplate extends Model<ITemplate> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @Column(DataType.STRING)
    name!: string

    @Column(DataType.STRING)
    description!: string

    @CreatedAt
    @Column(DataType.DATE)
    createdAt!: Date

    @UpdatedAt
    @Column(DataType.DATE)
    updatedAt!: Date

    @Column(DataType.JSON)
    itemsConfig!: {
        type: TestTemplateType
        requestSignalId: number | null
        requestSignals: IProtocolSignal[]
        colors?: string[]
        x: number
        y: number
        width: number
        height: number
        title: string
        interval: number
        trueValue?: string
        trueLabel?: string
        falseLabel?: string
        unit?: string
        during?: number
        min?: number
        max?: number
        label?: string
    }[]
}

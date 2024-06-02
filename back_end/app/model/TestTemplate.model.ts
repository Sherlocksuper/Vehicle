/**
 * 用来存放测试模板的模型
 */

import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table, UpdatedAt, CreatedAt} from "sequelize-typescript";
import {TestTemplateType} from "../constants";

export interface ITestTemplate {
    id?: number
    name: string
    description: string
    createdAt: Date
    updatedAt: Date
    itemConfig: {
        type: string
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

@Table({
    tableName: 'test_templates',
    timestamps: false
})

export class TestTemplate extends Model<ITestTemplate> {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number

    @Column(DataType.STRING)
    name!: string

    @Column(DataType.STRING)
    description!: string

    @CreatedAt
    createdAt!: Date

    @UpdatedAt
    updatedAt!: Date

    @Column(DataType.JSON)
    itemConfig!: {
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

export default TestTemplate;
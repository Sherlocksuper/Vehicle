/**
 * 用来存放测试模板的模型
 */

import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table, UpdatedAt, CreatedAt} from "sequelize-typescript";
import {TestTemplateType} from "../constants";

export interface ITestTemplate {
    id: number
    name: string
    description: string
    createTime: string
    updateTime: string
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
    @Column(DataType.STRING)
    createTime!: string

    @UpdatedAt
    @Column(DataType.STRING)
    updateTime!: string

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
import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript'
import TestObject from './2TestObject.model';
import User from './User.model';
import TestObjectN from "./2TestObjectN.model";

export interface ITestProcessNModel {
    id?: number
    userId: number
    testName: string
    createAt?: Date
    updateAt?: Date
}

@Table({
    tableName: 'test_processes_n'
})

/**
 * 新测试流程
 * 1.测试流程名称
 * 2.测试流程包含的测试对象
 * 3.测试流程所属用户
 */
export default class TestProcessN extends Model<ITestProcessNModel> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @Column(DataType.STRING)
    testName!: string;

    @HasMany(() => TestObjectN)
    testObjects!: TestObjectN[]

    @ForeignKey(() => User)
    @Column
    userId!: number

    @BelongsTo(() => User)
    user!: User
}
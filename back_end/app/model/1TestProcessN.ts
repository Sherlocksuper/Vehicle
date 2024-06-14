import {
    AutoIncrement,
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript'
import User from './User.model';
import {ITestObjectNModel} from "./2TestObjectN.model";
import {ITestTemplate} from "./PreSet/TestTemplate.model";

export interface ITestProcessNModel {
    id?: number
    userId: number
    testName: string
    testObjectNs: ITestObjectNModel[]
    template: ITestTemplate
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

    @ForeignKey(() => User)
    @Column
    userId!: number

    @Column(DataType.STRING)
    testName!: string;

    @Column(DataType.JSON)
    testObjectNs!: ITestObjectNModel[]

    @Column(DataType.JSON)
    template!: ITestTemplate

    @BelongsTo(() => User)
    user!: User
}
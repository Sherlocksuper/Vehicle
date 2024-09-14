import {AutoIncrement, BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import User from "./User.model";
import {ITestObjectNModel} from "./2TestObjectN.model";
import {ITestTemplate} from "./PreSet/TestTemplate.model";
import {ITestProcessNModel} from "./1TestProcessN";
import {IVehicleModel} from "./PreSet/Vehicle.model";
import {IProtocolSignal} from "./PreSet/Protocol.model";

export interface ITestConfig {
  id: number
  name: string
  configs: {
    vehicle: IVehicleModel,
    projects: {
      name: string,
      indicators: {
        name: string,
        signal: IProtocolSignal
      }[]
    }[]
  }[]
}

@Table({
  tableName: 'test_config'
})

/**
 * 新测试流程
 * 1.测试流程名称
 * 2.测试流程包含的测试对象
 * 3.测试流程所属用户
 */
export default class TestConfig extends Model<ITestConfig> {

  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column(DataType.STRING)
  name!: string;

  @Column(DataType.JSON)
  configs!: {
    vehicle: IVehicleModel,
    projects: {
      name: string,
      indicators: {
        name: string,
        signal: IProtocolSignal
      }[]
    }[]
  }[]
  //
  // @ForeignKey(() => User)
  // @Column
  // userId!: number
  //
  // @BelongsTo(() => User)
  // user!: User

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}

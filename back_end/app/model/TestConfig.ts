import {AutoIncrement, Column, CreatedAt, DataType,  Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";
import {ITemplate} from "./PreSet/TestTemplate.model";
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
  dataWrap: {
    equipmentType: string,
    equipmentId: string,
    version: string,
    useBeidou: boolean
  }
  template: ITemplate
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

  @Column(DataType.JSON)
  dataWrap!: {
    equipmentType: string,
    equipmentId: string,
    version: string,
    useBeidou: boolean
  }

  @Column(DataType.JSON)
  template!: ITemplate

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}



@Table({
  tableName: 'current_test_config'
})
export class CurrentTestConfig extends Model<ITestConfig> {
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

  @Column(DataType.JSON)
  dataWrap!: {
    equipmentType: string,
    equipmentId: string,
    version: string,
    useBeidou: boolean
  }

  @Column(DataType.JSON)
  template!: ITemplate

  @CreatedAt
  @Column
  createdAt!: Date

  @UpdatedAt
  @Column
  updatedAt!: Date
}
